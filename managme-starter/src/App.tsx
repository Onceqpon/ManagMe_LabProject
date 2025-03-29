import React from "react";
import { useAppLogic } from "./logicfunction/useAppLogic";
import { StoryState } from "./types/Story";
import { StoryPriority } from "./types/Story";

function App() {
  const {
    user,
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
    <div className="p-4">
      <h1 className="text-2xl font-bold">ManagMe - Projekty</h1>
      <p>Zalogowany: {user.firstName} {user.lastName}</p>

      {/* Formularz dodawania projektu */}
      <h2 className="mt-4 font-bold">Dodaj nowy projekt</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nazwa projektu"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Opis projektu"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddProject} className="bg-blue-500 text-white px-4 py-2">
          Dodaj projekt
        </button>
      </div>

      {/* Lista projektów */}
      <h2 className="mt-4 font-bold">Wybierz projekt</h2>
      <ul className="mb-4">
        {projects.map((project) => (
          <li key={project.id} className="mb-1">
            <button
              onClick={() => handleProjectSelect(project.id)}
              className={`px-4 py-2 border rounded ${
                activeProject === project.id ? "bg-green-500 text-white" : "bg-gray-200"
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
          <h3 className="font-bold">Dodaj historyjkę</h3>
          <input
            type="text"
            placeholder="Nazwa"
            value={storyName}
            onChange={(e) => setStoryName(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Opis"
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
            className="border p-2 mr-2"
          />
          <select
            value={storyPriority}
            onChange={(e) => setStoryPriority(e.target.value as StoryPriority)}
            className="border p-2 mr-2"
          >
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
          <button onClick={handleAddStory} className="bg-blue-500 text-white px-4 py-2">
            Dodaj
          </button>

          {/* Lista historyjek z możliwością zmiany statusu */}
          {["todo", "in-progress", "done"].map((state) => (
            <div key={state}>
              <h3 className="mt-4 font-bold">
                {state === "todo" && "Do zrobienia"}
                {state === "in-progress" && "W trakcie"}
                {state === "done" && "Zakończone"}
              </h3>
              <ul>
                {filterStoriesByState(state as StoryState).map((story) => (
                  <li key={story.id} className="flex items-center justify-between mb-2">
                    <span>
                      <strong>{story.name}</strong> ({story.priority}) - {story.description}
                    </span>
                    <button
                      onClick={() => handleChangeStoryState(story.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
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
