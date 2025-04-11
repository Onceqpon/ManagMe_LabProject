import React, { useState } from "react";
import { useAppLogic } from "./logicfunction/useAppLogic";
import ProjectsView from "./components/ProjectsView";
import StoriesView from "./components/StoriesView";
import "./styles/App.css";

function App() {
  const {
    activeProject,
  } = useAppLogic();

  // Stan do zarządzania widokiem
  const [view, setView] = useState<"projects" | "stories">("projects");

  return (
    <div className="app-container">
      {/* Przyciski nawigacyjne */}
      <div className="navigation-buttons">
        <button
          onClick={() => setView("projects")}
          className={`navigation-button ${view === "projects" ? "active" : ""}`}
        >
          Projekty
        </button>
        <button
          onClick={() => setView("stories")}
          className={`navigation-button ${view === "stories" ? "active" : ""}`}
        >
          Historyjki
        </button>
      </div>

      {/* Widok projektów */}
      {view === "projects" && (
        <ProjectsView
        />
      )}

      {/* Widok historyjek */}
      {view === "stories" && activeProject && (
        <StoriesView
        />
      )}
    </div>
  );
}

export default App;
