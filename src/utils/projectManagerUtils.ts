import Project from "../models/projectModel";
import ProjectAPI from "../managmeAPI/api";
import { createButton } from "../utils/domUtils";
import { createEditProjectModal } from "./projectModalUtils";
import { displayStoriesForCurrentProject } from "../utils/storyManagerUtils";
import { currentUser } from "../views/main";

const projectAPI = new ProjectAPI();
const projectList = document.getElementById("project-list")!;
const kanban = document.getElementById("kanban-board")!;
export let selectedProjectId: string | null = null;
export let selectedFeatures: boolean = true;

export async function displayProjects(): Promise<void> {
  let projects: Project[] = await projectAPI.getProjectsByUser();

  // Sortowanie po dacie utworzenia — od najnowszych do najstarszych
  projects = projects.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  if (!projectList || !kanban) return;

  projectList.innerHTML = "";

  // ⬇️ Ustal aktywny projekt
  const activeProject = projects.find((project) => project.active) || null;
  selectedProjectId = activeProject?.id || null;

  // ⬇️ Pokaż lub ukryj kanban
  kanban.style.display = selectedProjectId ? "flex" : "none";

  for (const project of projects) {
    const listItem = document.createElement("li");
    const buttonContainer = document.createElement("div");

    listItem.id = project.id;
    listItem.innerHTML = `<strong>${project.name}</strong><br>${project.description}<br>`;
    listItem.classList.toggle("active-project", project.active);

    if (project.id === selectedProjectId) {
      await displayStoriesForCurrentProject(project.id);
    }

    const selectButton = createButton("Select", "select-button", async () => {
      try {
        await selectProject(project);
      } catch (e) {
        console.error("Error selecting project:", e);
      }
    });

    const editButton = createButton("Edit", "edit-button", () => {
      try {
        const modal = createEditProjectModal(project);
        document.body.appendChild(modal);
      } catch (e) {
        console.error("Error opening edit modal:", e);
      }
    });

    const deleteButton = createButton("Delete", "delete-button", async () => {
      try {
        await deleteProject(project.id);
      } catch (e) {
        console.error("Error deleting project:", e);
      }
    });

    buttonContainer.className = "button-container";
    buttonContainer.append(selectButton, editButton, deleteButton);
    listItem.append(buttonContainer);
    projectList.appendChild(listItem);
  }
}

async function selectProject(project: Project): Promise<void> {
  if (selectedProjectId) {
    if (selectedProjectId === project.id) {
      if (project.active) {
        project.active = false;
        await projectAPI.updateProject(project);
        selectedProjectId = null;
      }
    } else {
      const prev = await projectAPI.getProjectById(selectedProjectId);
      if (prev && prev.active) {
        prev.active = false;
        await projectAPI.updateProject(prev);
      }
      project.active = true;
      selectedProjectId = project.id;
      await projectAPI.updateProject(project);
    }
  } else {
    project.active = true;
    selectedProjectId = project.id;
    await projectAPI.updateProject(project);
  }

  await displayProjects();
}

async function deleteProject(id: string): Promise<void> {
  await projectAPI.deleteStoriesByProjectId(id);
  await projectAPI.deleteProject(id);
  await displayProjects();
}

export async function addProject(event: Event): Promise<void> {
  event.preventDefault();
  const errorMessageField = document.getElementById("error-message")!;
  errorMessageField.textContent = "";

  const nameElement = document.getElementById("project-input") as HTMLInputElement;
  const descriptionElement = document.getElementById("description-input") as HTMLInputElement;
  const projectName = nameElement.value.trim();
  const projectDescription = descriptionElement.value.trim();

  if (!projectName || !projectDescription) {
    errorMessageField.textContent = "Please fill out all fields.";
    return;
  }

  const id = crypto.randomUUID();
  const newProject = new Project(id, projectName, projectDescription, currentUser?.id ?? undefined);

  try {
    await projectAPI.createProject(newProject);
    nameElement.value = "";
    descriptionElement.value = "";
    await displayProjects();
  } catch (e) {
    console.error("Error creating project:", e);
    errorMessageField.textContent = "Something went wrong. Please try again.";
  }
}

export async function deselectAllProjects(): Promise<void> {
  try {
    const projects: Project[] = await projectAPI.getAllProjects();
    for (const project of projects) {
      project.active = false;
      await projectAPI.updateProject(project);
    }
    await displayProjects();
  } catch (e) {
    console.error("Error deselecting projects:", e);
  }
}
