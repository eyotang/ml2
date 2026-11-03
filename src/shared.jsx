import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { tips, readStore, writeStore } from "./model";
export function useSavedState(key, init, courseId, onFailure) {
  const [value, set] = useState(init);
  useEffect(() => {
    const saved = courseId ? { ...readStore(key), [courseId]: value } : value;
    if (!writeStore(key, saved)) onFailure?.();
  }, [value, key, courseId]);
  const update = (recipe) =>
    set((previous) => {
      const next = structuredClone(previous);
      recipe(next);
      return next;
    });
  return [value, update];
}
export function Rich({ html = "", className = "", ...props }) {
  return (
    <div
      className={className}
      {...props}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
export function Dialog({ open, onClose, title, children, id, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      id={id}
      className={className}
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => open && onClose()}
    >
      <div
        className={
          id === "study-tips-dialog" ? "study-tips-header" : "dialog-top"
        }
      >
        <h2>{title}</h2>
        <button aria-label="关闭" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function StudyTips({ tip, onClose }) {
  const lesson = tips[tip] || tips.theory;
  return (
    <Dialog
      open={!!tip}
      onClose={onClose}
      title={lesson.title}
      id="study-tips-dialog"
      className="study-tips-dialog"
    >
      <div className="study-tips-body">
        <h3>答题框架</h3>
        <p className="study-tips-framework">{lesson.framework}</p>
        <h3>如何展开</h3>
        <ul>
          {lesson.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <h3>交卷前自检</h3>
        <ul>
          {lesson.checklist.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="study-tips-note">
          根据老师课件整理，具体作答请结合原题要求。
        </p>
        <a
          href={`https://ai-trainer-exam-courseware.app.workbuddy.host/?sharecode=U7DGZ5NTK5#${lesson.anchor}`}
          target="_blank"
          rel="noreferrer"
        >
          查看老师解析课件 ↗
        </a>
      </div>
    </Dialog>
  );
}
export function Template({ code, field }) {
  return code.split("{{}}").map((part, i, array) => (
    <React.Fragment key={i}>
      {part}
      {i < array.length - 1 && field(i)}
    </React.Fragment>
  ));
}
export function FlowChart({ html, field }) {
  const host = useRef(),
    [targets, setTargets] = useState([]);
  const markup = useMemo(
    () =>
      html.replace(
        /\{\{(\d+)\}\}/g,
        (_, i) => `<span data-flow-mount="${i}"></span>`,
      ),
    [html],
  );
  useLayoutEffect(
    () => setTargets([...host.current.querySelectorAll("[data-flow-mount]")]),
    [markup],
  );
  return (
    <>
      <div className="flow-legend">
        <span>▭ 处理动作</span>
        <span>◇ 条件判断</span>
        <span>→ 方向与条件</span>
        <span>◯ 同字母连接点</span>
      </div>
      <p className="flow-caption">
        直接在节点内填写。手机可横向拖动查看全图；图内拖动不会切换练习。该图为符合题意的一种参考结构，可使用其他合理方案。
      </p>
      <div ref={host} dangerouslySetInnerHTML={{ __html: markup }} />
      {targets.map((t) =>
        createPortal(
          field(Number(t.dataset.flowMount)),
          t,
          t.dataset.flowMount,
        ),
      )}
    </>
  );
}
export function swipeDirection(dx, dy, time) {
  return time <= 800 && Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.6
    ? dx < 0
      ? 1
      : -1
    : 0;
}
export function useSwipe({
  identity,
  onNavigate,
  canNavigate,
  enabled = true,
  onDrag,
  kind = "skill",
}) {
  const ref = useRef(),
    drag = useRef(null),
    blocked = useRef(false),
    incoming = useRef(null),
    latest = useRef();
  latest.current = { identity, onNavigate, canNavigate, enabled, onDrag };
  function reset() {
    ref.current?.getAnimations?.().forEach((a) => a.cancel());
    if (ref.current) ref.current.style.transform = "";
  }
  useLayoutEffect(() => {
    reset();
    drag.current = null;
    if (incoming.current) {
      const { dir, width } = incoming.current;
      incoming.current = null;
      ref.current?.animate(
        [
          {
            transform: `translateX(${dir * width}px)`,
            opacity: kind === "theory" ? 1 : 0.7,
          },
          { transform: "translateX(0)", opacity: 1 },
        ],
        { duration: kind === "theory" ? 180 : 150, easing: "ease-out" },
      );
    }
  }, [identity, enabled]);
  useEffect(() => () => reset(), []);
  function rebound(from) {
    reset();
    if (from && !matchMedia("(prefers-reduced-motion:reduce)").matches)
      ref.current?.animate(
        [{ transform: from }, { transform: "translateX(0)" }],
        { duration: 180, easing: "ease-out" },
      );
  }
  return {
    ref,
    onTouchStart: (e) => {
      reset();
      blocked.current = false;
      drag.current =
        latest.current.enabled &&
        e.touches.length === 1 &&
        !e.target.closest(
          "input,textarea,select,[contenteditable],.flow-scroll",
        )
          ? {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              time: Date.now(),
              id: latest.current.identity,
            }
          : null;
    },
    onTouchMove: (e) => {
      const d = drag.current;
      if (!d) return;
      if (e.touches.length !== 1) {
        drag.current = null;
        rebound(ref.current.style.transform);
        return;
      }
      const dx = e.touches[0].clientX - d.x,
        dy = e.touches[0].clientY - d.y;
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        rebound(ref.current.style.transform);
        return;
      }
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        blocked.current = true;
        latest.current.onDrag?.();
        ref.current.style.transform = `translateX(${latest.current.canNavigate(dx < 0 ? 1 : -1) ? dx : dx * 0.25}px)`;
      }
    },
    onTouchCancel: () => {
      drag.current = null;
      rebound(ref.current.style.transform);
    },
    onTouchEnd: async (e) => {
      const d = drag.current;
      drag.current = null;
      const from = ref.current?.style.transform;
      if (
        !d ||
        e.touches.length ||
        e.changedTouches.length !== 1 ||
        d.id !== latest.current.identity
      ) {
        rebound(from);
        return;
      }
      const dir = swipeDirection(
        e.changedTouches[0].clientX - d.x,
        e.changedTouches[0].clientY - d.y,
        Date.now() - d.time,
      );
      if (!dir || !latest.current.canNavigate(dir)) {
        rebound(from);
        return;
      }
      blocked.current = true;
      latest.current.onDrag?.();
      const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
      if (kind === "theory" && !reduced) {
        const width = ref.current.getBoundingClientRect().width;
        try {
          await ref.current.animate(
            [
              { transform: from || "translateX(0)" },
              { transform: `translateX(${-dir * width}px)` },
            ],
            { duration: 140, easing: "ease-out", fill: "forwards" },
          ).finished;
        } catch {
          return;
        }
        if (latest.current.identity !== d.id) return;
      }
      reset();
      if (!reduced)
        incoming.current = {
          dir,
          width:
            kind === "theory" ? ref.current.getBoundingClientRect().width : 30,
        };
      latest.current.onNavigate(dir);
    },
    onClickCapture: (e) => {
      if (blocked.current) {
        e.preventDefault();
        e.stopPropagation();
        blocked.current = false;
      }
    },
  };
}
