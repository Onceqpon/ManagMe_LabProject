import React from "react";
import { useAppLogic } from "../logicfunction/useAppLogic";
import "../styles/ProjectsView.css";

function ProjectsView() {
    const {
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
    } = useAppLogic();


    return (
        <div>
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
        </div>
      );
}

export default ProjectsView;

