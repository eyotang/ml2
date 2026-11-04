const numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
// Practice taskIndex belongs to written-answer matching. Keep that schema intact
// and group the code exercises separately for navigation.
export function groupLessons(course) {
  const titles = (course.tasks || []).map((t) =>
    t.title.replace(/^任务[一二三四五六七八九十\d]+\s*[·:：、]?\s*/, ""),
  );
  if (course.id === "b2")
    titles.unshift("数据清洗与业务分布分析", "算法训练与测试");
  if (course.id === "b12") titles.unshift("挖掘业务场景潜在机会点");
  if (!titles.length) titles.push("顺序练习");
  const groups = titles.map((title, index) => ({
    index,
    label: "任务" + (numbers[index] || index + 1),
    title,
    steps: [],
  }));
  course.steps.forEach((step, index) => {
    let task = step.taskIndex ?? 0;
    if (course.id === "b2")
      task =
        step.kind === "case"
          ? task + 2
          : Number(step.id.split("-").at(-1)) <= 6
            ? 0
            : 1;
    if (course.id === "b12") task = step.kind === "case" ? task + 1 : 0;
    (groups[task] || groups[0]).steps.push({ step, index });
  });
  return groups.filter((group) => group.steps.length);
}
