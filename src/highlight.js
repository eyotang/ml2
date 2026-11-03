const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const keywords = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(
    " ",
  ),
);
const builtins = new Set(
  "print len range int float str bool list dict set tuple sum min max abs round enumerate zip isinstance sorted open display".split(
    " ",
  ),
);
// Display-only tokenizer. The original text is always kept in the native textarea.
function highlight(source) {
  const pattern =
    /#[^\n]*|(?:[rubf]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b[A-Za-z_]\w*\b/gim;
  let html = "",
    end = 0;
  for (const match of source.matchAll(pattern)) {
    const token = match[0];
    let type = "";
    if (token.startsWith("#")) type = "comment";
    else if (/^[rubf]{0,2}['"]/i.test(token)) type = "string";
    else if (/^\d/.test(token)) type = "number";
    else if (keywords.has(token)) type = "keyword";
    else if (builtins.has(token)) type = "builtin";
    html +=
      escape(source.slice(end, match.index)) +
      (type
        ? `<span class="py-${type}">${escape(token)}</span>`
        : escape(token));
    end = match.index + token.length;
  }
  return html + escape(source.slice(end));
}
export { highlight };
