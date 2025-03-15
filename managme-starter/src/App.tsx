import { useState } from "react";
import { ProjectStorage } from "./utils/ProjectStorage";
import { Project } from "./types/Project";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [projects, setProjects] = useState<Project[]>(ProjectStorage.getAll());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProject = () => {
    if(!name || !description) return;

    const newProject: Project = { id: uuidv4(), name, description };
    ProjectStorage.add(newProject);
    setProjects([...projects, newProject]);
    
    setName("");
    setDescription("");
  };

  const handleDeleteProject = (id: string) => {
    ProjectStorage.delete(id);
    setProjects(ProjectStorage.getAll());
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ManagMe - Projekty</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nazwa projektu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Opis projektu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddProject} className="bg-blue-500 text-white px-4 py-2">
          Dodaj projekt
        </button>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="mb-2">
            <strong>{project.name}</strong>: {project.description}
            <button
              onClick={() => handleDeleteProject(project.id)}
              className="ml-4 bg-red-500 text-white px-2 py-1"
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
