import React from "react";
import { useAppLogic } from "./logicfunction/useAppLogic";
import { StoryState } from "./types/Story";
import { StoryPriority } from "./types/Story";
import "./styles/App.css";

function App() {
  const {
    projects,
    activeProject,
    projectName,
    projectDescription,
    storyName,
    storyDescription,
    storyPriority,
    setProjectName,
    setProjectDescription,
    setStoryName,
    setStoryDescription,
    setStoryPriority,
    handleAddProject,
    handleProjectSelect,
    handleAddStory,
    handleChangeStoryState,
    filterStoriesByState,
  } = useAppLogic();

  return (
    <div className="app-container">
      <h2 className="section-title">Dodaj nowy projekt</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Nazwa projektu"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Opis projektu"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="input-field"
        />
        <button onClick={handleAddProject} className="submit-button">
          Dodaj projekt
        </button>
      </div>

      {/* Lista projektów */}
      <h2 className="section-title">Wybierz projekt</h2>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <button
              onClick={() => handleProjectSelect(project.id)}
              className={`project-button ${
                activeProject === project.id ? "active-project" : ""
              }`}
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Formularz i lista historyjek */}
      {activeProject && (
        <>
          <h3 className="section-title">Dodaj historyjkę</h3>
          <div className="form-container">
            <input
              type="text"
              placeholder="Nazwa"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Opis"
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              className="input-field"
            />
            <select
              value={storyPriority}
              onChange={(e) => setStoryPriority(e.target.value as StoryPriority)}
              className="input-field"
            >
              <option value="niski">Niski</option>
              <option value="średni">Średni</option>
              <option value="wysoki">Wysoki</option>
            </select>
            <button onClick={handleAddStory} className="submit-button">
              Dodaj
            </button>
          </div>

          {/* Lista historyjek z możliwością zmiany statusu */}
          {["todo", "in-progress", "done"].map((state) => (
            <div key={state} className="state-section">
              <h3 className="state-title">
                {state === "todo" && "Do zrobienia"}
                {state === "in-progress" && "W trakcie"}
                {state === "done" && "Zakończone"}
              </h3>
              <ul className="story-list">
                {filterStoriesByState(state as StoryState).map((story) => (
                  <li key={story.id} className="story-item">
                    <span>
                      <strong>{story.name}</strong> ({story.priority}) - {story.description}
                    </span>
                    <button
                      onClick={() => handleChangeStoryState(story.id)}
                      className="change-status-button"
                    >
                      Zmień status
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
