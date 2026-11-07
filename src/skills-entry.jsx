import React from "react";
import { createRoot } from "react-dom/client";
import Skills from "./SkillsPage";
import { loadCourse } from "./model";
import "./styles/skills.css";
import "./styles/flowcharts.css";
import "./styles/study-tips.css";
import "./styles/theme.css";
const id = new URLSearchParams(location.search).get("course") || "b12";
loadCourse(id)
  .then((course) => {
    if (course)
      createRoot(document.getElementById("root")).render(
        <Skills courseId={id} />,
      );
    else location.replace("./#skills");
  })
  .catch(() => {
    const message = document.createElement("p");
    message.textContent = "练习加载失败，请检查网络后重试。";
    const retry = document.createElement("button");
    retry.textContent = "重新加载";
    retry.onclick = () => location.reload();
    document.getElementById("root").replaceChildren(message, retry);
  });
