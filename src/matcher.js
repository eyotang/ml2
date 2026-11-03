function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s，,。；;、：:（）()“”"'！!？?·]/g, "");
}
function positiveMention(text, term) {
  const hay = normalize(text),
    needle = normalize(term);
  if (!needle) return false;
  let start = 0,
    index;
  while ((index = hay.indexOf(needle, start)) !== -1) {
    const before = hay.slice(Math.max(0, index - 9), index),
      after = hay.slice(index + needle.length, index + needle.length + 7);
    if (
      !/(不建议|不推荐|不需要|无需|不必|不用|不应|不要|禁止|不允许|不能|没有|未|不|避免|杜绝)(进行|做|再|经过)?$/.test(
        before,
      ) &&
      !/^(可以|可|应当|应该)?(省略|跳过|忽略|取消)/.test(after)
    )
      return true;
    start = index + needle.length;
  }
  return false;
}
function check(slot, value, options = {}) {
  const text = normalize(value),
    exact = [
      slot.answer,
      ...(slot.accepted || []),
      ...(slot.matchRule?.aliases || []),
    ];
  if (!text) return { status: "review", message: "尚未填写" };
  if (exact.some((answer) => normalize(answer) === text))
    return { status: "covered", message: "已识别要点或近义表达" };
  if (
    (slot.choices || [])
      .filter((x) => x !== slot.answer)
      .some((wrong) => normalize(wrong) === text)
  )
    return { status: "conflict", message: "与本题要求不符，请对照约束修正" };
  if (/^\d+(?:\.\d+)?$/.test(normalize(slot.answer))) {
    if (
      /^[+-]?\d+(?:\.\d+)?$/.test(text) &&
      Number(text) === Number(slot.answer)
    )
      return { status: "covered", message: "数值一致" };
    const number = normalize(slot.answer).replace(".", "\\.");
    if (
      options.longAnswer &&
      new RegExp("(?:^|[^0-9.+-])" + number + "(?=$|[^0-9.])").test(text)
    )
      return {
        status: "covered",
        message: "已识别数值，仍需核对单位与边界条件",
      };
    return { status: "review", message: "数值和单位需准确，请核对参考值" };
  }
  const rule = slot.matchRule;
  if (rule?.aliases?.some((term) => positiveMention(value, term)))
    return { status: "covered", message: "已识别近义表达" };
  if (
    rule?.groups?.length &&
    rule.groups.every((group) =>
      group.some((term) => positiveMention(value, term)),
    )
  )
    return { status: "covered", message: "已覆盖所需关键含义" };
  if (positiveMention(value, slot.answer))
    return { status: "covered", message: "已识别核心要点" };
  return {
    status: "review",
    message: "本地规则未充分识别，不等同答错；请对照参考要点自检",
  };
}
function coverage(course, taskIndex, text) {
  return course.steps
    .filter((step) => step.taskIndex === taskIndex)
    .flatMap((step) =>
      step.slots.map((slot) => ({
        label: slot.answer,
        ...check(slot, text, { longAnswer: true }),
      })),
    );
}
export { check, coverage, normalize };
