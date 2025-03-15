import { useEffect, useState } from "react";
import { Project } from "./types/Project";
import { Story, StoryPriority, StoryState } from "./types/Story";
import { ProjectStorage } from "./utils/ProjectStorage";
import { ActiveProject } from "./utils/ActiveProject";
import { UserSession } from "./utils/UserSession";
import { StoryStorage } from "./utils/StoryStorage";
import { v4 as uuidv4 } from "uuid";

function App() {
  const user = UserSession.getLoggedUser();

  const [projects, setProjects] = useState<Project[]>(ProjectStorage.getAll());
  const [activeProject, setActiveProject] = useState<string | null>(ActiveProject.getActive());
  const [stories, setStories] = useState<Story[]>([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [storyName, setStoryName] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyPriority, setStoryPriority] = useState<StoryPriority>("średni");

  // Ładowanie historyjek po wyborze projektu
  useEffect(() => {
    if (activeProject) {
      setStories(StoryStorage.getByProject(activeProject));
    }
  }, [activeProject]);

  // Dodawanie projektu
  const handleAddProject = () => {
    if (!projectName || !projectDescription) return;

    const newProject: Project = {
      id: uuidv4(),
      name: projectName,
      description: projectDescription,
    };

    ProjectStorage.add(newProject);
    setProjects(ProjectStorage.getAll());
    setProjectName("");
    setProjectDescription("");
  };

  // Wybór projektu
  const handleProjectSelect = (id: string) => {
    ActiveProject.setActive(id);
    setActiveProject(id);
    setStories(StoryStorage.getByProject(id));
  };

  // Dodawanie historyjki
  const handleAddStory = () => {
    if (!storyName || !activeProject) return;

    const newStory: Story = {
      id: uuidv4(),
      name: storyName,
      description: storyDescription,
      priority: storyPriority,
      projectId: activeProject,
      createdAt: new Date().toISOString(),
      state: "todo",
      ownerId: user.id,
    };
    StoryStorage.add(newStory);
    setStories(StoryStorage.getByProject(activeProject));

    setStoryName("");
    setStoryDescription("");
  };

  // Zmiana statusu historyjki
  const handleChangeStoryState = (storyId: string) => {
    if (!activeProject) return;

    const allStories = StoryStorage.getByProject(activeProject);
    const updatedStories = allStories.map((story) => {
      if (story.id === storyId) {
        let newState: StoryState;
        switch (story.state) {
          case "todo":
            newState = "in-progress";
            break;
          case "in-progress":
            newState = "done";
            break;
          case "done":
          default:
            newState = "todo";
            break;
        }
        return { ...story, state: newState };
      }
      return story;
    });

    // Aktualizacja w localStorage
    localStorage.setItem(
      "stories",
      JSON.stringify([
        ...StoryStorage.getAll().filter((s) => s.projectId !== activeProject),
        ...updatedStories,
      ])
    );

    setStories(updatedStories);
  };

  // Filtrowanie historyjek po stanie
  const filterStoriesByState = (state: StoryState) =>
    stories.filter((story) => story.state === state);

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
