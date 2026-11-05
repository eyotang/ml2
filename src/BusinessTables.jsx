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
      : { "1-1-0": 0, "2-2-2": 1, "2-1-2": 2 };
  return (
    <div className="training-plan business-tables">
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
                  const key = `${g}-${r}-${c}`;
                  let content = value;
                  if (field && slots[key] !== undefined) {
                    const i = slots[key];
                    content =
                      step === "b11-2" && i === 1 ? (
                        <>
                          产品ID、{field(i)}
                          、状态版本、处置指令、有效时间；包装校验记录。
                        </>
                      ) : step === "b11-2" && i === 2 ? (
                        <>
                          检测记录ID、模型版本、分数、规则版本、分流路径；人工结论及
                          {field(i)}。
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
