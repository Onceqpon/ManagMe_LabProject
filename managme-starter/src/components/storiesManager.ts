import { Story } from "../../managme-api/model/storyModel";
import { displayProjects } from "./projectManager";
import ProjectAPI from "../../managme-api/services/storageService";
import { createStoryCard } from "./detailsComponent";
import { createAddStoryModal, createEditStoryModal } from "./editStoreisWindow";
import { showModalWithTasksForStory } from "./editTasksWindow";
import { selectedProjectId } from "./projectManager";
const projectAPI = new ProjectAPI();
const kanban = document.getElementById("kanban-board")!;

export function displayStoriesForCurrentProject(
  currentProjectId: string
): void {
  const stories = projectAPI.getStoriesByProjectId(currentProjectId);
  console.log(stories);

  kanban.style.display = stories && stories.length > 0 ? "flex" : "none";

  const todoContainer = document.getElementById("Todo-stories")!;
  const doingContainer = document.getElementById("Doing-stories")!;
  const doneContainer = document.getElementById("Done-stories")!;

  if (!stories || !todoContainer || !doingContainer || !doneContainer) return;

  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const sortedStories = stories.sort((a, b) => {
    const priorityOrder = { Low: 0, Medium: 1, High: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function dragStart(event: any, storyId: string) {
    event.dataTransfer.setData("text/plain", storyId);
  }

  sortedStories.forEach((story) => {
    const storyCard = createStoryCard(story);
    storyCard.id = story.id;
    storyCard.draggable = true;
    storyCard.addEventListener("dragstart", (event) =>
      dragStart(event, story.id)
    );

    const container = (status: string, containerElement: HTMLElement) => {
      if (story.status === status) {
        containerElement.appendChild(storyCard);
        storyCard.classList.remove("Doing", "Done");
        storyCard.classList.add(status);
      }
    };

    container("Todo", todoContainer);
    container("Doing", doingContainer);
    container("Done", doneContainer);
  });
}

export function editStory(story: Story): void {
  const modal = createEditStoryModal(story);
  document.body.appendChild(modal);
}

export function deleteStory(id: string): void {
  projectAPI.deleteStory(id);
  displayProjects();
}
export function showTasks(id: string): void {
  const modal = showModalWithTasksForStory(id);
  document.body.appendChild(modal);
}

export function addStory(event: Event): void {
  event.preventDefault();
  const errorMessageField = document.getElementById("error-message")!;
  errorMessageField.textContent = "";

  if (!selectedProjectId) {
    errorMessageField.textContent = "No project selected.";
    return;
  }

  const modal = createAddStoryModal(selectedProjectId);
  if (modal) {
    document.body.appendChild(modal);
  }
}
