import React from "react";
import { AutoBlank } from "./shared";
export const trainingFields = [
  ["topic", "培训主题"],
  ["audience", "培训对象"],
  ["goal", "培训目标"],
  ["content", "培训内容"],
  ["method", "教学方法"],
  ["output", "考核与产出"],
];
export function trainingPlanText(task, p) {
  return task.trainingPlan
    .map((row) =>
      trainingFields
        .map(([key]) => p.trainingDrafts?.[task.id]?.[row.id]?.[key] || "")
        .join("\n"),
    )
    .join("\n");
}
export default function TrainingPlan({ task, p, update, field }) {
  return (
    <div className="training-plan">
      {task.trainingPlan.map((row) => (
        <table key={row.id}>
          <caption>{row.title}</caption>
          <tbody>
            {trainingFields.map(([key, label]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                <td>
                  {update ? (
                    <AutoBlank
                      className="blank training-input"
                      data-training-row={row.id}
                      data-training-field={key}
                      aria-label={`${row.title} · ${label}`}
                      placeholder={`填写${label}`}
                      value={p.trainingDrafts?.[task.id]?.[row.id]?.[key] || ""}
                      onChange={(e) =>
                        update((n) => {
                          n.trainingDrafts ??= {};
                          n.trainingDrafts[task.id] ??= {};
                          n.trainingDrafts[task.id][row.id] ??= {};
                          n.trainingDrafts[task.id][row.id][key] =
                            e.target.value;
                          delete n.caseSelf?.[task.id];
                        })
                      }
                    />
                  ) : (
                    (field && row.practice?.[key]
                      ? row.practice[key]
                      : row.values[key]
                    )
                      .split(/(\{\{\d+\}\})/g)
                      .map((part, i) =>
                        /^\{\{\d+\}\}$/.test(part) ? (
                          <React.Fragment key={i}>
                            {field(Number(part.slice(2, -2)))}
                          </React.Fragment>
                        ) : (
                          part
                        ),
                      )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
