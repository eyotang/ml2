import React, { useEffect, useRef, useState } from "react";
const dataFiles = {
  b12: ["meeting_bookings.csv", "meeting_rooms.csv"],
  b2: ["cold_chain_shipments.csv"],
};
export function usePythonRuntime({ courseId, editorRef, code }) {
  const [state, setState] = useState({
      busy: false,
      status: "环境按需加载，点击运行后开始。",
      outputs: [],
      lastSource: null,
    }),
    worker = useRef(null),
    outputSize = useRef(0),
    truncated = useRef(false),
    busy = useRef(false);
  function stop(text) {
    worker.current?.terminate();
    worker.current = null;
    busy.current = false;
    setState((p) => ({ ...p, busy: false, status: text }));
  }
  function reset() {
    outputSize.current = 0;
    truncated.current = false;
    setState((p) => ({ ...p, outputs: [], lastSource: null }));
    stop("环境与运行结果已重置，原题可重新填写。");
  }
  useEffect(
    () => () => {
      worker.current?.terminate();
      worker.current = null;
      busy.current = false;
    },
    [courseId],
  );
  function push(item) {
    const size = JSON.stringify(item).length;
    setState((p) => {
      if (p.outputs.length >= 300 || outputSize.current + size > 3000000) {
        if (truncated.current) return p;
        truncated.current = true;
        return {
          ...p,
          outputs: [
            ...p.outputs,
            {
              kind: "stderr",
              text: "输出过多，已截断显示；可以停止运行并调整代码。",
            },
          ],
        };
      }
      outputSize.current += size;
      return { ...p, outputs: [...p.outputs, item] };
    });
  }
  function run(fresh) {
    if (busy.current) return;
    const editor = editorRef.current,
      selected = editor.value.slice(editor.selectionStart, editor.selectionEnd),
      source = fresh ? code : selected,
      lineOffset =
        editor.value.slice(0, editor.selectionStart).split("\n").length - 1;
    if (!source.trim()) {
      setState((p) => ({
        ...p,
        status: fresh
          ? "请先填写代码。"
          : "请先在代码框中选中需要运行的完整语句。",
      }));
      return;
    }
    busy.current = true;
    outputSize.current = 0;
    truncated.current = false;
    setState({
      busy: true,
      status: "准备运行…",
      outputs: [],
      lastSource: code,
    });
    try {
      if (!worker.current) {
        const w = new Worker(
          new URL("python-worker.js?v=24", document.baseURI),
          { type: "module" },
        );
        worker.current = w;
        w.onmessage = ({ data }) => {
          if (worker.current !== w) return;
          if (data.type === "status")
            setState((p) => ({ ...p, status: data.text }));
          else if (["stdout", "stderr"].includes(data.type))
            push({ kind: data.type, text: data.text });
          else if (data.type === "display") push(data.value);
          else if (data.type === "done") {
            busy.current = false;
            setState((p) => ({
              ...p,
              busy: false,
              status: "运行完成。输出为当前代码的真实结果，不代表已自动判分。",
            }));
          } else if (data.type === "error") {
            busy.current = false;
            setState((p) => ({
              ...p,
              busy: false,
              status: "运行出错，请根据下方信息修改代码。",
            }));
            push({ kind: "stderr", text: data.text });
            if (!data.recoverable) {
              w.terminate();
              worker.current = null;
            }
          }
        };
        w.onerror = (e) => {
          if (worker.current !== w) return;
          push({
            kind: "stderr",
            text:
              e.message ||
              "Python 环境加载失败，请检查网络或部署网站的运行文件访问权限。",
          });
          stop("运行环境未能启动；代码已保留，可以重试。");
        };
      }
      worker.current.postMessage({
        fresh,
        code: fresh ? source : "\n".repeat(lineOffset) + source,
        courseId,
        files: dataFiles[courseId].map((name) => ({
          name,
          url: new URL("materials/data/" + name, document.baseURI).href,
        })),
      });
    } catch (error) {
      push({ kind: "stderr", text: String(error.message || error) });
      stop("无法启动运行环境，代码已保留。");
    }
  }
  return { state, code, run, stop, reset };
}
export default function PythonRunner({ runtime }) {
  const { state, code, run, stop, reset } = runtime;
  return (
    <section id="python-runner" aria-label="运行 Python 代码">
      <div className="runner-toolbar">
        <button disabled={state.busy} onClick={() => run(true)}>
          ▶ 运行全部
        </button>
        <button disabled={state.busy} onClick={() => run(false)}>
          运行选中代码
        </button>
        <button
          disabled={!state.busy}
          onClick={() => stop("已停止，运行环境已释放；已填写的代码保留。")}
        >
          停止
        </button>
        <button
          onClick={() => {
            if (
              state.busy &&
              !confirm(
                "正在运行，确定停止并重置 Python 环境？填写的代码不会清除。",
              )
            )
              return;
            reset();
          }}
        >
          重置环境
        </button>
      </div>
      <p className="runner-status" role="status">
        {!state.busy && state.outputs.length && state.lastSource !== code
          ? "代码已修改，下方是上次运行结果；请重新运行。"
          : state.status}
      </p>
      <div className="runner-output" aria-label="Python 运行输出">
        {state.outputs.map((item, i) =>
          item.kind === "table" ? (
            <div className="runner-table" key={i}>
              <table>
                <thead>
                  <tr>
                    {item.columns.map((v, j) => (
                      <th key={j}>{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((r, k) => (
                    <tr key={k}>
                      {r.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <small>
                {item.totalRows} 行 × {item.totalColumns} 列
                {item.totalRows > 100 || item.totalColumns > 30
                  ? "（预览最多 100 行、30 列）"
                  : ""}
              </small>
            </div>
          ) : item.kind === "image" ? (
            <img
              key={i}
              alt="Python 生成的图表"
              src={"data:image/png;base64," + item.data}
            />
          ) : (
            <pre
              key={i}
              className={item.kind === "stderr" ? "runner-error" : ""}
            >
              {item.text}
            </pre>
          ),
        )}
      </div>
      <small className="runner-note">
        真实 Python 运算 · 原题 CSV 自动载入 ·
        运行全部从干净变量环境开始；运行选中代码沿用当前变量。首次需联网加载运行库。
      </small>
    </section>
  );
}
