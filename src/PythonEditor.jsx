import React, { useLayoutEffect, useRef, useState } from "react";
import { highlight } from "./highlight";
export default function PythonEditor({ value, onChange, editorRef }) {
  const syntax = useRef(),
    numbers = useRef(),
    selection = useRef(),
    [scroll, setScroll] = useState({ left: 0, top: 0 });
  useLayoutEffect(() => {
    if (selection.current) {
      editorRef.current.setSelectionRange(...selection.current);
      selection.current = null;
    }
  }, [value]);
  function key(e) {
    if (e.isComposing) return;
    if (e.key === "Escape") {
      document.querySelector("#python-runner button")?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    e.preventDefault();
    const editor = editorRef.current,
      start = editor.selectionStart,
      end = editor.selectionEnd;
    let text = value;
    if (start === end && !e.shiftKey) {
      text = value.slice(0, start) + "    " + value.slice(end);
      selection.current = [start + 4, start + 4];
    } else {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1,
        block = value.slice(lineStart, end),
        updated = e.shiftKey
          ? block.replace(/^(?: {1,4}|\t)/gm, "")
          : block.replace(/^/gm, "    ");
      text = value.slice(0, lineStart) + updated + value.slice(end);
      selection.current = [lineStart, lineStart + updated.length];
    }
    onChange(text);
  }
  return (
    <div className="python-editor">
      <div className="editor-header">
        Python<small>Tab 缩进 · Esc 离开编辑区</small>
      </div>
      <div className="editor-body">
        <div className="editor-gutter" aria-hidden="true">
          <pre
            ref={numbers}
            style={{ transform: `translateY(${-scroll.top}px)` }}
          >
            {Array.from(
              { length: value.split("\n").length },
              (_, i) => i + 1,
            ).join("\n")}
          </pre>
        </div>
        <div className="editor-viewport">
          <pre
            className="editor-syntax"
            aria-hidden="true"
            ref={syntax}
            style={{
              transform: `translate(${-scroll.left}px, ${-scroll.top}px)`,
            }}
            dangerouslySetInnerHTML={{
              __html: highlight(value) + (value.endsWith("\n") ? " " : ""),
            }}
          />
          <textarea
            className="original-editor"
            aria-label="原题代码"
            ref={editorRef}
            value={value}
            wrap="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={key}
            onScroll={(e) =>
              setScroll({ left: e.target.scrollLeft, top: e.target.scrollTop })
            }
          />
        </div>
      </div>
    </div>
  );
}
