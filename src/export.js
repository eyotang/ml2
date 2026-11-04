import { filledCode, TYPES, questions } from "./model";
export const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const textHTML = (value) => "<pre>" + escapeHTML(value) + "</pre>";
function outputHTML(item) {
  if (item.kind === "image")
    return (
      '<img alt="Python 图表" src="data:image/png;base64,' + item.data + '">'
    );
  if (item.kind === "table")
    return (
      "<table><thead><tr>" +
      item.columns.map((v) => "<th>" + escapeHTML(v) + "</th>").join("") +
      "</tr></thead><tbody>" +
      item.rows
        .map(
          (row) =>
            "<tr>" +
            row.map((v) => "<td>" + escapeHTML(v) + "</td>").join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table><p>" +
      item.totalRows +
      " 行 × " +
      item.totalColumns +
      " 列（与页面预览范围相同）</p>"
    );
  return textHTML(item.text);
}
export function flowSVG(html, values) {
  const doc = new DOMParser().parseFromString(html, "text/html"),
    canvas = doc.querySelector(".flow-canvas");
  if (!canvas) return "";
  const width = parseFloat(canvas.style.width),
    height = parseFloat(canvas.style.height);
  const lines = canvas.querySelector(".flow-lines").innerHTML;
  const boxes = [...canvas.querySelectorAll(".flow-box")]
    .map((box) => {
      const x = parseFloat(box.style.left),
        y = parseFloat(box.style.top),
        w = parseFloat(box.style.width),
        h = parseFloat(box.style.height);
      const text = box.cloneNode(true);
      text.querySelectorAll("svg").forEach((s) => s.remove());
      text.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
      const content = text.textContent.replace(
        /\{\{(\d+)\}\}/g,
        (_, i) => values[i] || "（未填）",
      );
      let shape;
      if (box.classList.contains("flow-decision"))
        shape = `<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}"/>`;
      else
        shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${box.classList.contains("flow-terminal") || box.classList.contains("flow-connector") ? h / 2 : 8}"/>`;
      const rows = content.split("\n").flatMap((line) => {
        const result = [];
        const limit = Math.max(
          5,
          (box.classList.contains("flow-decision") ? w * 0.62 : w - 22) / 14,
        );
        let row = "",
          length = 0;
        for (const char of line) {
          const size = /[\u0000-\u00ff]/.test(char) ? 0.55 : 1;
          if (length + size > limit && row) {
            result.push(row);
            row = "";
            length = 0;
          }
          row += char;
          length += size;
        }
        if (row) result.push(row);
        return result.length ? result : [""];
      });
      const maxRows = Math.max(1, Math.floor((h - 12) / 20));
      if (rows.length > maxRows) {
        rows.length = maxRows;
        rows[maxRows - 1] += "…";
      }
      return `<g fill="#f2fbf9" stroke="#4f8f83" stroke-width="1.5">${shape}</g><text fill="#173e37" text-anchor="middle" font-size="14" font-family="sans-serif">${rows.map((line, i) => `<tspan x="${x + w / 2}" y="${y + h / 2 + (i - (rows.length - 1) / 2) * 20}">${escapeHTML(line)}</tspan>`).join("")}</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><g font-family="sans-serif" font-size="13" fill="#47675e">${lines}</g>${boxes}</svg>`;
}
export function skillReport(course, p, runtime) {
  const blocks = [
    { heading: course.title + " · 我的练习记录" },
    {
      text:
        "导出时间：" +
        new Date().toLocaleString("zh-CN") +
        "。本文件保存个人填写与自评；主观题判定仅为练习提示。",
    },
  ];
  if (course.kind !== "case") {
    blocks.push(
      { heading: "原题代码" },
      { text: p.originalDraft ?? course.originalCode, code: true },
    );
    if (runtime?.outputs?.length) {
      blocks.push(
        { heading: "最近一次运行结果" },
        {
          text:
            runtime.lastSource !== (p.originalDraft ?? course.originalCode)
              ? "注意：代码已修改，下列结果属于上次运行。"
              : "下列为最近一次运行输出。",
        },
      );
      runtime.outputs.forEach((item) => blocks.push({ output: item }));
    }
    if (p.originalSelf) blocks.push({ text: "原题自评：" + p.originalSelf });
  }
  for (const task of course.tasks || []) {
    blocks.push(
      { heading: task.title },
      { text: p.caseDrafts?.[task.id] || "（尚未填写文字答案）" },
    );
    if (task.flowchart) {
      const values = p.flowDrafts?.[task.id] || [];
      blocks.push({ svg: flowSVG(task.flowchart.html, values) });
      blocks.push({
        text:
          "流程图节点填写：\n" +
          task.flowchart.slots
            .map((_, i) => `${i + 1}. ${values[i] || "（未填）"}`)
            .join("\n"),
      });
    }
    if (p.caseSelf?.[task.id])
      blocks.push({ text: "自评：" + p.caseSelf[task.id] });
  }
  blocks.push({ heading: "分步练习填写记录" });
  for (const step of course.steps)
    for (const mode of ["pick", "type"]) {
      const values =
        p.draftsByMode?.[mode]?.[step.id] ??
        p.records[step.id]?.modeAnswers?.[mode]?.values;
      if (values?.some(Boolean))
        blocks.push(
          {
            heading:
              step.title + " · " + (mode === "pick" ? "点选补全" : "关键填空"),
          },
          { text: filledCode(step, values), code: true },
        );
    }
  return blocks;
}
export function reportHTML(blocks) {
  return (
    '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>我的练习记录</title><style>body{font:16px/1.8 system-ui;max-width:960px;margin:30px auto;padding:0 20px;color:#203c36}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f2f7f5;padding:14px;font:14px/1.8 monospace}img,svg{max-width:100%;height:auto}table{border-collapse:collapse;display:block;overflow:auto}td,th{border:1px solid #bacdc5;padding:6px}h2{margin-top:30px}</style>' +
    blocks
      .map((b) =>
        b.heading
          ? "<h2>" + escapeHTML(b.heading) + "</h2>"
          : b.svg || (b.output ? outputHTML(b.output) : textHTML(b.text)),
      )
      .join("") +
    "</html>"
  );
}
export function notebook(course, p, runtime) {
  const code = p.originalDraft ?? course.originalCode,
    outputs = (runtime?.outputs || []).map((item) =>
      item.kind === "image"
        ? {
            output_type: "display_data",
            data: { "image/png": item.data },
            metadata: {},
          }
        : item.kind === "table"
          ? {
              output_type: "display_data",
              data: {
                "text/html": outputHTML(item),
                "text/plain": JSON.stringify(item.rows),
              },
              metadata: {},
            }
          : {
              output_type: "stream",
              name: item.kind === "stderr" ? "stderr" : "stdout",
              text: item.text || "",
            },
    );
  return JSON.stringify(
    {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3",
        },
      },
      cells: [
        {
          id: "note",
          cell_type: "markdown",
          metadata: {},
          source: [
            "我的原题填写。请与原题 CSV 放在同一目录运行。" +
              (runtime?.lastSource && runtime.lastSource !== code
                ? "代码已修改，输出属于上次运行。"
                : ""),
          ],
        },
        {
          id: "code",
          cell_type: "code",
          metadata: {},
          execution_count: null,
          source: code.split(/(?<=\n)/),
          outputs,
        },
        ...skillReport(course, p, null)
          .filter((b) => b.text && !b.code)
          .map((b, i) => ({
            id: "answer-" + i,
            cell_type: "markdown",
            metadata: {},
            source: [b.text],
          })),
      ],
    },
    null,
    2,
  );
}
// Minimal uncompressed ZIP, sufficient for standards-compliant OOXML without a runtime dependency.
export function zip(files) {
  const enc = new TextEncoder(),
    parts = [],
    central = [];
  let offset = 0;
  const header = (size) => new DataView(new ArrayBuffer(size));
  function crc(bytes) {
    let n = 0xffffffff;
    for (const b of bytes) {
      n ^= b;
      for (let i = 0; i < 8; i++) n = (n >>> 1) ^ (n & 1 ? 0xedb88320 : 0);
    }
    return (n ^ 0xffffffff) >>> 0;
  }
  for (const [name, value] of Object.entries(files)) {
    const filename = enc.encode(name),
      bytes = typeof value === "string" ? enc.encode(value) : value,
      check = crc(bytes),
      h = header(30);
    h.setUint32(0, 0x04034b50, true);
    h.setUint16(4, 20, true);
    h.setUint16(6, 0x800, true);
    h.setUint32(14, check, true);
    h.setUint32(18, bytes.length, true);
    h.setUint32(22, bytes.length, true);
    h.setUint16(26, filename.length, true);
    parts.push(new Uint8Array(h.buffer), filename, bytes);
    const c = header(46);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x800, true);
    c.setUint32(16, check, true);
    c.setUint32(20, bytes.length, true);
    c.setUint32(24, bytes.length, true);
    c.setUint16(28, filename.length, true);
    c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), filename);
    offset += 30 + filename.length + bytes.length;
  }
  const size = central.reduce((n, b) => n + b.length, 0),
    end = header(22);
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, Object.keys(files).length, true);
  end.setUint16(10, Object.keys(files).length, true);
  end.setUint32(12, size, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
async function png(svg) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return {
      data: canvas.toDataURL("image/png").split(",")[1],
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function wordDocument(blocks) {
  const x = escapeHTML,
    files = {},
    relations = [],
    body = [];
  let imageId = 0;
  const paragraph = (text, heading = false) =>
    "<w:p>" +
    (heading ? '<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>' : "") +
    '<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:eastAsia="Microsoft YaHei"/></w:rPr>' +
    String(text ?? "")
      .split("\n")
      .map(
        (line, i) =>
          (i ? "<w:br/>" : "") +
          '<w:t xml:space="preserve">' +
          x(line) +
          "</w:t>",
      )
      .join("") +
    "</w:r></w:p>";
  for (const b of blocks) {
    let image = b.svg
      ? await png(b.svg)
      : b.output?.kind === "image"
        ? { data: b.output.data, width: 960, height: 480 }
        : null;
    if (image) {
      const id = ++imageId,
        name = `image${id}.png`;
      files["word/media/" + name] = Uint8Array.from(atob(image.data), (c) =>
        c.charCodeAt(0),
      );
      relations.push(
        `<Relationship Id="rImg${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`,
      );
      const scale = Math.min(1, 590 / image.width, 880 / image.height),
        cx = Math.round(image.width * scale * 9525),
        cy = Math.round(image.height * scale * 9525);
      body.push(
        `<w:p><w:r><w:drawing><wp:inline><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="流程图或运行图表 ${id}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rImg${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`,
      );
    } else if (b.output?.kind === "table") {
      const t = b.output;
      body.push(
        "<w:tbl>" +
          [t.columns, ...t.rows]
            .map(
              (row) =>
                "<w:tr>" +
                row.map((v) => "<w:tc>" + paragraph(v) + "</w:tc>").join("") +
                "</w:tr>",
            )
            .join("") +
          "</w:tbl>",
      );
      body.push(
        paragraph(
          `${t.totalRows} 行 × ${t.totalColumns} 列（与页面预览范围相同）`,
        ),
      );
    } else
      body.push(paragraph(b.heading ?? b.text ?? b.output?.text, b.heading));
  }
  files["[Content_Types].xml"] =
    '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  files["_rels/.rels"] =
    '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rDocument" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  files["word/_rels/document.xml.rels"] =
    '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    relations.join("") +
    "</Relationships>";
  files["word/document.xml"] =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>' +
    body.join("") +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>';
  return zip(files);
}
export function download(name, contents, type = "text/html;charset=utf-8") {
  const url = URL.createObjectURL(
      contents instanceof Blob ? contents : new Blob([contents], { type }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export function theoryReport(state) {
  return [
    { heading: "理论知识 · 我的答题记录" },
    ...questions.flatMap((q) => {
      const r = state.records[q.id],
        draft = state.drafts[q.id];
      if (!r && !draft) return [];
      return [
        { heading: `${q.id + 1}. ${TYPES[q.type]} · ${q.text}` },
        {
          text:
            q.type === 3
              ? draft || "（尚未填写）"
              : (r.selected || [])
                  .map((i) => String.fromCharCode(65 + i) + ". " + q.options[i])
                  .join("\n"),
        },
        {
          text: r?.stale
            ? "题目已更新，需重新作答。上次记录：" +
              JSON.stringify(r.previousResult)
            : r?.self ||
              (r?.correct === true
                ? "正确"
                : r?.correct === false
                  ? "错误"
                  : "尚未判定"),
        },
      ];
    }),
  ];
}
