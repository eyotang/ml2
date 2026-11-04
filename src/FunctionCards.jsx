import React from "react";
import { AutoBlank } from "./shared";

export const functionFields = [
  ["code", "功能编号"],
  ["name", "功能名称"],
  ["role", "使用角色及触发条件"],
  ["behavior", "功能行为"],
  ["output", "输出结果"],
  ["acceptance", "验收标准"],
];
const cards = [
  {
    id: "monitor",
    step: "c-1",
    code: "F-01",
    name: "客流态势监测",
    role: "值班监控员；活动启用时持续监测。",
    behavior:
      "融合闸机、票务、区域传感器和移动终端事件，按区域计算当前人数、密度、容量占比及未来15分钟人数趋势，展示风险等级和数据质量标记。",
    output: "分区看板和预测预警。",
    acceptance:
      "在约定负载和测量起止点下，区域状态更新延迟不超过10秒，通过历史回放验证。",
    practice: {
      behavior:
        "持续接入多源数据，预测未来 {{0}} 分钟风险，展示分区人数、密度、容量占比与质量标记。",
      acceptance: "{{1}}；明确约定负载和测量起止点，通过历史回放验证。",
    },
  },
  {
    id: "plan",
    step: "c-2",
    code: "F-02",
    name: "疏导方案生成",
    role: "值班负责人；预测风险或等待时间达到已配置阈值时触发。",
    behavior:
      "生成入口分流、路线引导和人员岗位建议，说明依据、目标区域和生效范围，推送负责人确认；可修改或驳回。",
    output: "带版本、待确认状态的方案及批准后的执行任务。",
    acceptance:
      "风险事件产生至可审核方案生成不超过60秒；发布事件100%关联有效负责人确认记录，未确认不得发布。",
    practice: {
      behavior:
        "方案包括 {{0}}，说明依据、目标区域和生效范围。发布前必须 {{1}}，可修改或驳回。",
    },
  },
  {
    id: "feedback",
    step: "c-3",
    code: "F-03",
    name: "处置反馈闭环",
    role: "现场工作人员与值班负责人；方案发布后启动。",
    behavior:
      "现场终端回传执行回执，系统对比执行前后客流，持续观察；无缓解则重新生成升级方案并再次确认，结束后归档。",
    output: "执行状态、效果曲线与可追溯档案。",
    acceptance:
      "抽检任务中，生成、确认、发布、执行回执、效果和结束记录完整率100%，可查询导出；未结束任务不能伪造结束记录。",
    practice: {
      behavior:
        "现场终端回传执行状态，观察客流变化；未缓解时 {{0}}，结束后归档。",
      acceptance: "{{1}}，可查询导出；未结束任务不能伪造结束记录。",
    },
  },
];
function values(p, card) {
  return {
    code: card.code,
    name: card.name,
    ...p.functionCardDrafts?.ct1?.[card.id],
  };
}
export function functionCardsText(p) {
  return cards
    .map((card) =>
      functionFields.map(([key]) => values(p, card)[key] || "").join("\n"),
    )
    .join("\n");
}
export function FunctionCardsEditor({ p, update }) {
  return (
    <div className="function-cards">
      {cards.map((card) => (
        <fieldset className="function-card" key={card.id}>
          <legend>
            {card.code} · {card.name}
          </legend>
          <div className="function-card-fields">
            {functionFields.map(([key, label]) => (
              <label className="function-card-field" key={key}>
                <span>{label}</span>
                <AutoBlank
                  className="blank function-card-input"
                  data-function-card={card.id}
                  data-function-field={key}
                  aria-label={`${card.name} · ${label}`}
                  value={values(p, card)[key] || ""}
                  placeholder={`填写${label}`}
                  onChange={(e) =>
                    update((n) => {
                      n.functionCardDrafts ??= {};
                      n.functionCardDrafts.ct1 ??= {};
                      n.functionCardDrafts.ct1[card.id] ??= {};
                      n.functionCardDrafts.ct1[card.id][key] = e.target.value;
                      delete n.caseSelf?.ct1;
                    })
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
export function ReferenceFunctionCards() {
  return (
    <div className="function-cards function-card-reference">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
      <p>验收数值为参考设计示例，实际作答需说明测量条件、范围及验证方法。</p>
    </div>
  );
}
export function hasFunctionCard(q) {
  return cards.some((card) => card.step === q.id);
}
export function FunctionCardStep({ q, field }) {
  const card = cards.find((card) => card.step === q.id);
  return (
    <Card
      card={card}
      renderValue={(key) => {
        const value = card.practice[key] || card[key];
        return value
          .split(/(\{\{\d+\}\})/g)
          .map((part, i) =>
            /^\{\{\d+\}\}$/.test(part) ? (
              <React.Fragment key={i}>
                {field
                  ? field(Number(part.slice(2, -2)))
                  : q.slots[Number(part.slice(2, -2))].answer}
              </React.Fragment>
            ) : (
              part
            ),
          );
      }}
    />
  );
}
function Card({ card, renderValue = (key) => card[key] }) {
  return (
    <article className="function-card">
      <h3>
        {card.code} · {card.name}
      </h3>
      <dl className="function-card-fields">
        {functionFields.map(([key, label]) => (
          <div className="function-card-field" key={key}>
            <dt>{label}</dt>
            <dd>{renderValue(key)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
