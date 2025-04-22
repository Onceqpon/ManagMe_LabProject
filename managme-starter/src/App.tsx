import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Importujemy React Router
import { useAppLogic } from "./logicfunction/useAppLogic";
import ProjectsView from "./components/ProjectsView";
import StoriesView from "./components/StoriesView";
import TaskAddView from "./components/TaskAddView"; // Dodajemy komponent do dodawania zadań
import "./styles/App.css";

function App() {
  const { activeProject } = useAppLogic();

  return (
    <Router>
      <div className="app-container">

        <div className="navigation-buttons">
          <Link to="/projects">
            <button
              className={`navigation-button`}
              >
              Projekty
            </button>
          </Link>
          <Link to="/stories">
            <button
              className={`navigation-button`}
            >
              Historyjki
            </button>
          </Link>
          <Link to="/add-task">
            <button
              className={`navigation-button`}
            >
              Dodaj zadanie
            </button>
          </Link>
        </div>

        <Routes>

          <Route path="/projects" element={<ProjectsView />} />

          <Route path="/stories" element={activeProject ? <StoriesView /> : <div>Wybierz projekt</div>} />

          <Route path="/add-task" element={<TaskAddView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
