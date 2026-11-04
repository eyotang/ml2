import { readStore, writeStore, reconcileSaved } from "./model";

// Record the user's actual edits so an unrelated answer from another tab is
// never replaced by a stale whole-page snapshot. Object replacement is kept
// explicit, including resets and deletions.
export function collectEdits(value, recipe) {
  const draft = structuredClone(value),
    edits = [],
    proxies = new WeakMap();
  const copy = (value) =>
    value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  function wrap(target, path = []) {
    if (!target || typeof target !== "object") return target;
    if (proxies.has(target)) return proxies.get(target);
    const proxy = new Proxy(target, {
      get(object, key) {
        return wrap(Reflect.get(object, key), [...path, key]);
      },
      set(object, key, value) {
        const location = [...path, key];
        if (location.length === 1 && key === "favorites") {
          const before = object[key] || [],
            after = copy(value);
          edits.push({
            path: location,
            add: after.filter((id) => !before.includes(id)),
            remove: before.filter((id) => !after.includes(id)),
          });
        } else
          edits.push({
            path: location,
            value: copy(value),
            initialize:
              object[key] === undefined &&
              value &&
              typeof value === "object" &&
              Object.values(value).every((v) => v === "" || v == null),
          });
        Reflect.set(object, key, value);
        return true;
      },
      deleteProperty(object, key) {
        edits.push({ path: [...path, key], deleted: true });
        return Reflect.deleteProperty(object, key);
      },
    });
    proxies.set(target, proxy);
    return proxy;
  }
  recipe(wrap(draft));
  return { value: copy(draft), edits };
}
export function applyEdits(value, edits) {
  const next = structuredClone(value);
  for (const edit of edits) {
    let parent = next;
    for (let i = 0; i < edit.path.length - 1; i++) {
      const key = edit.path[i];
      parent[key] ??= /^\d+$/.test(String(edit.path[i + 1])) ? [] : {};
      parent = parent[key];
    }
    const key = edit.path.at(-1);
    if (edit.add)
      parent[key] = [
        ...new Set([
          ...(parent[key] || []).filter((id) => !edit.remove.includes(id)),
          ...edit.add,
        ]),
      ];
    else if (edit.deleted) delete parent[key];
    else if (!edit.initialize || parent[key] === undefined)
      parent[key] = structuredClone(edit.value);
  }
  return next;
}
export function localNavigation(value, courseId) {
  const keys = courseId
    ? ["index", "mode", "stepId"]
    : [
        "current",
        "mode",
        "view",
        "filter",
        "filterIds",
        "auto",
        "autoJumpVersion",
      ];
  return Object.fromEntries(
    keys.filter((key) => key in value).map((key) => [key, value[key]]),
  );
}
export function latestSaved(key, local, courseId) {
  const stored = courseId ? readStore(key)[courseId] : readStore(key);
  return reconcileSaved(
    key,
    { ...stored, ...localNavigation(local, courseId) },
    courseId,
  );
}
export function persistEdits(key, local, edits, courseId) {
  const next = reconcileSaved(
    key,
    applyEdits(latestSaved(key, local, courseId), edits),
    courseId,
  );
  const payload = courseId ? { ...readStore(key), [courseId]: next } : next;
  return { value: next, saved: writeStore(key, payload) };
}
