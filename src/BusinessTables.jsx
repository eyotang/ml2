import React from "react";
import { AutoBlank } from "./shared";
export function businessText(p) {
  return Object.values(p.businessDrafts?.b11t1 || {}).join("\n");
}
export default function BusinessTables({ task, p, update, step, field }) {
  const groups = task.businessTables;
  const shown = step === "b11-1" ? [0] : step === "b11-2" ? [1, 2] : [0, 1, 2];
  const slots =
    step === "b11-1"
      ? { "0-0-0": 0, "0-2-0": 1, "0-3-0": 2 }
      : {
          "1-1-0": 0,
          "io-3-3": 1,
          "io-2-3": 2,
          "io-0-1": 3,
          "io-1-2": 4,
          "io-1-3": 5,
          "io-4-1": 6,
          "io-4-3": 7,
          "io-5-3": 8,
        };
  return (
    <div className="training-plan business-tables">
      {update &&
        Object.keys(p.businessDrafts?.[task.id] || {}).some((k) =>
          k.startsWith("2-"),
        ) && (
          <details>
            <summary>查看旧版输入输出表的填写</summary>
            {Object.entries(p.businessDrafts[task.id])
              .filter(([k, v]) => k.startsWith("2-") && v)
              .map(([k, v]) => (
                <p key={k}>
                  第{Number(k.split("-")[1]) + 1}行 ·{" "}
                  {
                    ["记录方向", "来源或去向", "关键字段"][
                      Number(k.split("-")[2])
                    ]
                  }
                  ：{v}
                </p>
              ))}
          </details>
        )}
      {shown.map((g) => (
        <table key={g}>
          <caption>{groups[g].title}</caption>
          <thead>
            <tr>
              {groups[g].headers.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups[g].rows.map((row, r) => (
              <tr key={r}>
                {row.map((value, c) => {
                  const key = `${g === 2 ? "io" : g}-${r}-${c}`;
                  let content = value;
                  if (field && slots[key] !== undefined) {
                    const i = slots[key];
                    content =
                      step === "b11-2" && i === 1 ? (
                        <>
                          产品编号、{field(i)}
                          （已放行/已隔离/待检）、状态更新时间
                        </>
                      ) : step === "b11-2" && i === 2 ? (
                        <>
                          产品编号、复核结论（合格/不合格/待定）、
                          {field(i)}。
                        </>
                      ) : step === "b11-2" && i === 5 ? (
                        <>{field(i)}、缺陷分数、推理时间、模型版本号</>
                      ) : step === "b11-2" && i === 7 ? (
                        <>
                          产品编号、处置决定（放行/返工/报废）、处置人、时间；
                          {field(i)}
                        </>
                      ) : step === "b11-2" && i === 8 ? (
                        <>
                          图像ID、模型原分数、人工最终结论、{field(i)}
                          、关联模型版本
                        </>
                      ) : (
                        field(i)
                      );
                  }
                  return (
                    <td key={c}>
                      {update ? (
                        <AutoBlank
                          className="blank training-input"
                          data-business-cell={key}
                          aria-label={`${groups[g].title}第${r + 1}行${groups[g].headers[c]}`}
                          placeholder={`填写${groups[g].headers[c]}`}
                          value={p.businessDrafts?.[task.id]?.[key] || ""}
                          onChange={(e) =>
                            update((n) => {
                              n.businessDrafts ??= {};
                              n.businessDrafts[task.id] ??= {};
                              n.businessDrafts[task.id][key] = e.target.value;
                              delete n.caseSelf?.[task.id];
                            })
                          }
                        />
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
