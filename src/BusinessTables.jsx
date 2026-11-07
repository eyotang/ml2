import React from "react";
import { AutoBlank } from "./shared";
// Keys follow the table rows and columns. Values are stable saved-answer indices.
const traceSlots = {
  "1-1-0": 0,
  "io-0-1": 3,
  "io-1-2": 4,
  "io-1-3": 5,
  "io-2-3": 2,
  "io-3-3": 1,
  "io-4-1": 6,
  "io-4-3": 7,
  "io-5-3": 8,
};
export function practiceSlotOrder(step) {
  return step.id === "b11-2"
    ? Object.values(traceSlots)
    : step.slots.map((_, index) => index);
}
export function businessText(p, taskId = "b11t1") {
  return Object.values(p.businessDrafts?.[taskId] || {}).join("\n");
}
export default function BusinessTables({ task, p, update, step, field }) {
  const groups =
    task.businessTables ||
    task.pathTables ||
    task.reviewTables ||
    task.conclusionTables;
  const shown = task.conclusionTables
    ? step === "b2-18"
      ? [0]
      : step === "b2-19"
        ? [1]
        : [0, 1]
    : task.reviewTables
      ? step === "b11-7"
        ? [0]
        : step === "b11-8"
          ? [1]
          : [0, 1]
      : task.pathTables
        ? [0]
        : step === "b11-1"
          ? [0]
          : step === "b11-2"
            ? [1, 2]
            : [0, 1, 2];
  const slots = task.conclusionTables
    ? step === "b2-18"
      ? { "0-0-1": 0, "0-1-1": 1, "0-2-1": 2 }
      : { "1-1-1": 0, "1-2-1": 1, "1-3-1": 2 }
    : task.reviewTables
      ? step === "b11-7"
        ? { "0-0-2": 0, "0-1-1": 1 }
        : { "1-0-1": 0, "1-1-1": 1 }
      : task.pathTables
        ? { "0-0-2": 0, "0-1-2": 1 }
        : step === "b11-1"
          ? { "0-0-0": 0, "0-2-0": 1, "0-3-0": 2 }
          : traceSlots;
  const retiredBoundary =
    update && task.businessTables
      ? ["1-2-0", "1-2-1"]
          .map((key) => p.businessDrafts?.[task.id]?.[key])
          .filter(Boolean)
      : [];
  return (
    <div
      className={`training-plan business-tables ${task.reviewTables ? "review-tables" : ""}`}
    >
      {update &&
        !task.pathTables &&
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
      {retiredBoundary.length > 0 && (
        <details>
          <summary>查看旧版职责补充填写</summary>
          <p>{retiredBoundary.join("：")}</p>
        </details>
      )}
      {shown.map((g) => (
        <table
          key={g}
          className={
            task.businessTables && g === 0 ? "module-framework" : undefined
          }
        >
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
                    content = task.conclusionTables ? (
                      field(i)
                    ) : task.reviewTables ? (
                      step === "b11-7" ? (
                        i === 0 ? (
                          <>
                            用{field(i)}
                            比较缺陷召回率与漏检率，验证实际漏放风险。
                          </>
                        ) : (
                          <>采集已核实的{field(i)}回流训练，并改善光照。</>
                        )
                      ) : (
                        <>
                          {i === 0
                            ? "经独立抽检确认实际不合格的自动放行件数"
                            : "质量人员最终确认合格的自动隔离件数"}{" "}
                          ÷ {field(i)}
                        </>
                      )
                    ) : task.pathTables ? (
                      i === 0 ? (
                        <>
                          图像模糊→旧分数作废→{field(i)}
                          ；补拍可用则按新分数分流，仍不可用则实物检查，按人工结论处置。
                        </>
                      ) : (
                        <>
                          图像清晰且0.12&lt;0.20→{field(i)}
                          →包装前状态校验；暴露细小凹陷漏检风险。
                        </>
                      )
                    ) : step === "b11-2" && i === 1 ? (
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
                  // Keep the previous action-column key after inserting the scene column.
                  const draftKey =
                    task.businessTables && g === 0
                      ? `0-${r}-${[0, "scene", 1][c]}`
                      : key;
                  return (
                    <td key={c}>
                      {update &&
                      (task.reviewTables || task.conclusionTables
                        ? c > 0
                        : (!task.pathTables || c === 2) &&
                          !(task.businessTables && g === 2 && c === 0)) ? (
                        <AutoBlank
                          className="blank training-input"
                          data-business-cell={draftKey}
                          aria-label={`${groups[g].title}第${r + 1}行${groups[g].headers[c]}`}
                          placeholder={groups[g].headers[c]}
                          value={p.businessDrafts?.[task.id]?.[draftKey] || ""}
                          onChange={(e) =>
                            update((n) => {
                              n.businessDrafts ??= {};
                              n.businessDrafts[task.id] ??= {};
                              n.businessDrafts[task.id][draftKey] =
                                e.target.value;
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
