import React from "react";
import { AutoBlank } from "./shared";
// Structured written answers share the existing per-task draft/reset storage.
export default function AnswerTables({ task, step, field, p, update }) {
  const practice = step?.tablePractice;
  const groups = practice
    ? [practice.table]
    : task.answerTables.map((_, i) => i);
  return (
    <div className="training-plan business-tables answer-tables">
      {groups.map((g) => {
        const table = task.answerTables[g];
        return (
          <div key={g} className="answer-table-scroll">
            {table.headers.length > 3 && (
              <small className="table-scroll-hint">表格可左右滑动查看</small>
            )}
            <table className={`table-columns-${table.headers.length}`}>
              <caption>{table.title}</caption>
              <thead>
                <tr>
                  {table.headers.map((h) => (
                    <th scope="col" key={h}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, r) => {
                  if (practice?.rows && !practice.rows.includes(r)) return null;
                  return (
                    <tr key={r}>
                      {row.map((text, c) => {
                        const key = `${g}-${r}-${c}`;
                        const template = practice?.cells[`${r}-${c}`];
                        return (
                          <td key={c}>
                            {update &&
                            (table.editableColumns
                              ? table.editableColumns.includes(c)
                              : c > 0) ? (
                              <AutoBlank
                                className="blank training-input"
                                data-answer-cell={key}
                                aria-label={`${table.title}第${r + 1}行${table.headers[c]}`}
                                placeholder={table.headers[c]}
                                value={p.businessDrafts?.[task.id]?.[key] || ""}
                                onChange={(e) =>
                                  update((n) => {
                                    n.businessDrafts ??= {};
                                    n.businessDrafts[task.id] ??= {};
                                    n.businessDrafts[task.id][key] =
                                      e.target.value;
                                    delete n.caseSelf?.[task.id];
                                  })
                                }
                              />
                            ) : template !== undefined ? (
                              template.split(/(\{\{\d+\}\})/).map((part, i) => {
                                const match = part.match(/^\{\{(\d+)\}\}$/);
                                return (
                                  <React.Fragment key={i}>
                                    {match ? (
                                      <span className="table-blank">
                                        {field
                                          ? field(Number(match[1]))
                                          : step.slots[Number(match[1])].answer}
                                      </span>
                                    ) : (
                                      part
                                    )}
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              text
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
