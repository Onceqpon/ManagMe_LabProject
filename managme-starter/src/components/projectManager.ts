import Project from "../../managme-api/model/projectModel";
import ProjectAPI from "../../managme-api/services/storageService";
import { createButton } from "./detailsComponent";
import { createEditProjectModal } from "./editProjectWindow";
import { displayStoriesForCurrentProject } from "./storiesManager";

const projectAPI = new ProjectAPI();
const projectList = document.getElementById("project-list")!;
const kanban = document.getElementById("kanban-board")!;
export let selectedProjectId: string | null = null;
// eslint-disable-next-line prefer-const
export let selectedFeatures: boolean = true;

export function displayProjects(): void {
  const projects: Project[] = projectAPI.getAllProjects();
  if (!projectList || !kanban) return;

  kanban.style.display = projects.some((project) => project.active)
    ? "flex"
    : "none";
  selectedProjectId = projects.find((project) => project.active)?.id || null;

  projectList.innerHTML = "";
  projects.forEach((project) => {
    const listItem = document.createElement("li");
    listItem.id = project.id;
    listItem.innerHTML = `<strong>${project.name}</strong><br>${project.description}<br>`;
    listItem.classList.toggle("active-project", project.active);
    if (project.active) {
      displayStoriesForCurrentProject(project.id);
    }
    const selectButton = createButton("Select", "select-button", () =>
      selectProject(project)
    );
    const editButton = createButton("Edit", "edit-button", () =>
      editProject(project)
    );
    const deleteButton = createButton("Delete", "delete-button", () =>
      deleteProject(project.id)
    );
    listItem.append(selectButton, editButton, deleteButton);
    projectList.appendChild(listItem);
  });
}

function selectProject(project: Project): void {
  if (selectedProjectId) {
    if (selectedProjectId === project.id) {
      project.active = false;
      projectAPI.updateProject(project);
      selectedProjectId = null;
    } else {
      const prevSelectedProject = projectAPI.getProjectById(selectedProjectId);
      if (prevSelectedProject) {
        prevSelectedProject.active = false;
        projectAPI.updateProject(prevSelectedProject);
      }

      project.active = true;
      selectedProjectId = project.id;
      projectAPI.updateProject(project);
    }
  } else {
    project.active = true;
    selectedProjectId = project.id;
    projectAPI.updateProject(project);
  }

  displayProjects();
}

function editProject(project: Project): void {
  const modal = createEditProjectModal(project);
  document.body.appendChild(modal);
}

function deleteProject(id: string): void {
  projectAPI.deleteStoriesByProjectId(id);
  projectAPI.deleteProject(id);
  displayProjects();
}

export function addProject(event: Event): void {
  event.preventDefault();
  const errorMessageField = document.getElementById("error-message")!;
  errorMessageField.textContent = "";

  const nameElement = document.getElementById(
    "project-input"
  ) as HTMLInputElement;
  const descriptionElement = document.getElementById(
    "description-input"
  ) as HTMLInputElement;
  const projectName = nameElement.value.trim();
  const projectDescription = descriptionElement.value.trim();

  if (!projectName || !projectDescription) {
    errorMessageField.textContent = "Please fill out all fields.";
    return;
  }

  const id = Date.now().toString();
  const newProject = new Project(id, projectName, projectDescription);
  projectAPI.createProject(newProject);
  nameElement.value = "";
  descriptionElement.value = "";
  displayProjects();
}

export function deselectAllProjects(): void {
  const projects: Project[] = projectAPI.getAllProjects();
  projects.forEach((project) => {
    project.active = false;
    projectAPI.updateProject(project);
  });
  displayProjects();
}
