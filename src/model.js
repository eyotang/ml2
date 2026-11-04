import data from "./generated/data.json";
import { check as matchWritten } from "./matcher";
export const { questions, courses, tips } = data;
export const TYPES = ["判断题", "单选题", "多选题", "简答题"];
export function readStore(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}
export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function theoryState(search = "", saved = readStore("zhilian-v1")) {
  const s = {
    current: 0,
    mode: "answer",
    view: "all",
    filter: "all",
    filterIds: null,
    auto: true,
    records: {},
    favorites: [],
    drafts: {},
    ...saved,
  };
  reconcileTheory(s);
  if (s.autoJumpVersion !== 1) {
    s.auto = true;
    s.autoJumpVersion = 1;
  }
  if (!questions[s.current]) s.current = 0;
  const p = new URLSearchParams(search);
  if (["all", "wrong", "favorites"].includes(p.get("view"))) {
    s.view = p.get("view");
    s.filter = "all";
    s.filterIds = null;
  }
  if (["answer", "study"].includes(p.get("mode"))) s.mode = p.get("mode");
  const list = questionList(s);
  if (list.length && !list.some((q) => q.id === s.current))
    s.current = list[0].id;
  return s;
}
export function questionList(s) {
  return questions.filter(
    (q) =>
      (s.view === "wrong"
        ? s.records[q.id]?.correct === false
        : s.view === "favorites"
          ? s.favorites.includes(q.id)
          : true) &&
      (s.filter === "all" ||
        !Array.isArray(s.filterIds) ||
        s.filterIds.includes(q.id)),
  );
}
export function courseState(id, saved = readStore("zhilian-skills-v1")[id]) {
  const c = courses[id],
    p = {
      index: 0,
      mode: "pick",
      records: {},
      drafts: {},
      ...saved,
    };
  if (c.kind !== "case" && p.answerSchema !== 2) {
    if (id === "b2")
      for (const [key, order] of [
        ["b2-5", [1, 0, 2]],
        ["b2-9", [0, 2, 1]],
      ]) {
        const reorder = (arr) => order.map((i) => arr[i]);
        const clean = (arr) =>
          key === "b2-5"
            ? arr.map((v, i) =>
                i === 2 && typeof v === "string"
                  ? v.replace(/^['"]|['"]$/g, "")
                  : v,
              )
            : arr;
        if (p.drafts[key]) p.drafts[key] = clean(reorder(p.drafts[key]));
        for (const v of Object.values(p.records[key]?.modeAnswers || {})) {
          if (v.values) v.values = clean(reorder(v.values));
          if (v.matches) v.matches = reorder(v.matches);
        }
      }
    p.answerSchema = 2;
  }
  p.draftsByMode = p.draftsByMode || {
    pick: structuredClone(p.drafts),
    type: structuredClone(p.drafts),
  };
  if (
    id === "b12" &&
    p.courseSchema !== 3 &&
    !p.stepId &&
    p.index >= 7 &&
    p.index < 12 &&
    c.steps.length === 14
  )
    p.index += 2;
  if (p.stepId) {
    const index = c.steps.findIndex((q) => q.id === p.stepId);
    if (index >= 0) p.index = index;
  }
  if (!c.steps[p.index]) p.index = 0;
  p.courseSchema = 3;
  p.stepId = c.steps[p.index].id;
  p.drafts = p.draftsByMode[p.mode === "type" ? "type" : "pick"] || {};
  reconcileCourse(p, c);
  return p;
}
export function courseValues(p, q) {
  return (
    p.draftsByMode[p.mode === "type" ? "type" : "pick"]?.[q.id] ||
    q.slots.map(() => "")
  );
}
export function setCourseValues(p, q, values) {
  const mode = p.mode === "type" ? "type" : "pick";
  p.draftsByMode[mode] ??= {};
  p.draftsByMode[mode][q.id] = values;
  p.drafts = p.draftsByMode[mode];
}
export function resetMode(p, mode, id) {
  if (id) delete p.draftsByMode[mode][id];
  else p.draftsByMode[mode] = {};
  p.drafts = p.draftsByMode[mode];
  for (const [key, r] of Object.entries(p.records)) {
    if (id && key !== id) continue;
    delete r.modeAnswers?.[mode];
    const left = Object.values(r.modeAnswers || {});
    if (!left.length) delete p.records[key];
    else {
      r.correct = left.some((v) => v.matches?.every(Boolean));
      r.needsReview = left.some((v) =>
        v.details?.some((d) => d.status === "review"),
      );
      r.reviewed = true;
    }
  }
}
export function resetOriginal(p) {
  delete p.originalDraft;
  delete p.originalSelf;
  p.caseDrafts = {};
  p.caseSelf = {};
  p.flowDrafts = {};
  p.functionCardDrafts = {};
  p.jsonDrafts = {};
  p.taskChecks = {};
}
export function normalizeCode(s) {
  return String(s)
    .trim()
    .replace(/(["'])(.*?)\1|\s+/g, (m, q, c) => (q ? JSON.stringify(c) : ""));
}
export const sameAnswers = (a, b) =>
  a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");
export function choices(items) {
  const hash = (s) =>
    [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  return [...items].sort((a, b) => hash(a) - hash(b));
}
export function filledCode(q, values) {
  return q.code
    .split("{{}}")
    .map(
      (part, i) => part + (i < q.slots.length ? values?.[i] || "________" : ""),
    )
    .join("");
}

export function revision(value) {
  let hash = 2166136261;
  for (const char of JSON.stringify(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
export function questionRevision(q) {
  return revision([q.type, q.text, q.options]);
}
export function reconcileTheory(state) {
  state.records ??= {};
  state.favorites ??= [];
  state.drafts ??= {};
  for (const [id, r] of Object.entries(state.records)) {
    const q = questions[id];
    if (!q) continue;
    const current = questionRevision(q),
      answer = revision(q.type === 3 ? q.points : q.answer);
    if (
      (r.questionRevision && r.questionRevision !== current) ||
      (q.type === 3 && r.answerRevision && r.answerRevision !== answer)
    ) {
      r.stale = true;
      r.previousResult ??= {
        selected: r.selected,
        self: r.self,
        correct: r.correct,
      };
      delete r.correct;
      delete r.self;
    }
    r.questionRevision = current;
    r.answerRevision = answer;
    if (!r.stale && q.type < 3 && Array.isArray(r.selected))
      r.correct = sameAnswers(r.selected, q.answer);
  }
  return state;
}
export function checkStep(course, q, mode, values) {
  return q.slots.map((slot, i) => {
    const value = values[i] ?? "";
    if (!String(value).trim()) return { status: "review", message: "尚未填写" };
    return (course.kind === "case" || q.kind === "case") && mode === "type"
      ? matchWritten(slot, value)
      : {
          status: [slot.answer, ...(slot.accepted || [])].some(
            (answer) => normalizeCode(answer) === normalizeCode(value),
          )
            ? "covered"
            : "conflict",
        };
  });
}
export function reconcileCourse(state, course) {
  for (const [id, r] of Object.entries(state.records)) {
    const q = course.steps.find((q) => q.id === id);
    if (!q) continue;
    const current = revision([
      q.code,
      q.slots.map((slot) => [slot.answer, slot.accepted, slot.matchRule]),
    ]);
    for (const [mode, answer] of Object.entries(r.modeAnswers || {})) {
      if (!Array.isArray(answer.values)) continue;
      answer.details = checkStep(course, q, mode, answer.values);
      answer.matches = answer.details.map((d) => d.status === "covered");
      answer.revision = current;
    }
    const modes = Object.keys(r.modeAnswers || {}),
      last =
        (modes.includes(r.lastCheckedMode) ? r.lastCheckedMode : null) ||
        (modes.includes(state.mode) ? state.mode : modes.at(-1));
    if (last) {
      const a = r.modeAnswers[last];
      r.correct = a.matches?.every(Boolean) ?? false;
      r.needsReview = a.details?.some((d) => d.status === "review") ?? false;
    }
  }
  return state;
}
export function reconcileSaved(key, state, courseId) {
  return key === "zhilian-v1"
    ? theoryState("", state)
    : courseState(courseId, state);
}
