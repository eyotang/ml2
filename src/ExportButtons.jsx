import React, { useState } from "react";
import {
  download,
  skillReport,
  reportHTML,
  notebook,
  wordDocument,
} from "./export";
export default function ExportButtons({ course, p, runtime }) {
  const [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  async function save(format) {
    setBusy(true);
    setStatus("正在导出…");
    try {
      const name = course.id || course.title;
      const blocks = skillReport(course, p, runtime);
      if (format === "html")
        download(name + "-我的练习.html", reportHTML(blocks));
      else if (format === "docx")
        download(name + "-我的练习.docx", await wordDocument(blocks));
      else
        download(
          name + "-我的练习.ipynb",
          notebook(course, p, runtime),
          "application/x-ipynb+json",
        );
      setStatus("已生成下载文件。");
    } catch {
      setStatus("导出失败，填写内容已保留，请重试。");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="export-tools" aria-label="导出我的练习">
      <span>导出我的答案</span>
      <button disabled={busy} onClick={() => save("html")}>
        网页
      </button>
      <button disabled={busy} onClick={() => save("docx")}>
        Word
      </button>
      {course.kind !== "case" && (
        <button disabled={busy} onClick={() => save("ipynb")}>
          Notebook
        </button>
      )}
      <small role="status">{status}</small>
    </div>
  );
}
