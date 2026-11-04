import React from "react";

export function validateJSON(value) {
  if (!value.trim())
    return { status: "empty", message: "填写后自动校验 JSON 格式。" };
  try {
    JSON.parse(value);
    return {
      status: "valid",
      message: "JSON 格式正确；字段含义与业务要求仍需核对。",
    };
  } catch (error) {
    const position = /position (\d+)/i.exec(error.message);
    const location = /line (\d+) column (\d+)/i.exec(error.message);
    let line, column;
    if (position) {
      const before = value.slice(0, Number(position[1]));
      line = before.split("\n").length;
      column = before.length - before.lastIndexOf("\n");
    } else if (location) {
      line = Number(location[1]);
      column = Number(location[2]);
    } else if (/Unexpected token/i.test(error.message)) {
      // Some browsers omit positions; skip valid JSON tokens to locate the invalid character.
      const tokens =
        /"(?:\\.|[^"\\])*"|true\b|false\b|null\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:\s]+|./gs;
      const invalid = [...value.matchAll(tokens)].find(
        (token) => token[0].length === 1 && !/["0-9{}\[\],:\s]/.test(token[0]),
      );
      if (invalid) {
        const before = value.slice(0, invalid.index);
        line = before.split("\n").length;
        column = before.length - before.lastIndexOf("\n");
      }
    } else if (/end of JSON/i.test(error.message)) {
      line = value.split("\n").length;
      column = value.length - value.lastIndexOf("\n");
    }
    return {
      status: "invalid",
      message: `JSON 格式错误${line ? `（第 ${line} 行，第 ${column} 列）` : ""}：${error.message}。请检查双引号、逗号、括号及小写 true / false，不要写注释。`,
    };
  }
}
export default function JsonFeedback({ value, incomplete = false, id }) {
  const result = incomplete
    ? { status: "empty", message: "填完全部空位后自动校验 JSON 格式。" }
    : validateJSON(value);
  return (
    <p
      id={id}
      className={`json-feedback json-${result.status}`}
      role="status"
      aria-live="polite"
      data-json-status={result.status}
    >
      {result.message}
    </p>
  );
}
