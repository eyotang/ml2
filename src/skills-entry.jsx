import React from "react";
import { createRoot } from "react-dom/client";
import Skills from "./SkillsPage";
import { courses } from "./model";
import "./styles/skills.css";
import "./styles/flowcharts.css";
import "./styles/study-tips.css";
const id = new URLSearchParams(location.search).get("course") || "b12";
if (courses[id])
  createRoot(document.getElementById("root")).render(<Skills courseId={id} />);
else location.replace("./#skills");
