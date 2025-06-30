import { Story } from "../models/storyModel";
import { displayProjects } from "./projectManagerUtils";
import ProjectAPI from "../managmeAPI/api";
import { createStoryCard } from "../utils/domUtils";
import { createAddStoryModal, createEditStoryModal } from "./storyModalUtils";
import { showModalWithTasksForStory } from "./taskModalUtils";
import { selectedProjectId } from "./projectManagerUtils";

const projectAPI = new ProjectAPI();
const kanban = document.getElementById("kanban-board")!;

export async function displayStoriesForCurrentProject(currentProjectId: string): Promise<void> {
  const stories = await projectAPI.getStoriesByProjectId(currentProjectId);
  if (!stories) return;

  kanban.style.display = stories.length > 0 ? "flex" : "none";

  const todoContainer = document.getElementById("Todo-stories")!;
  const doingContainer = document.getElementById("Doing-stories")!;
  const doneContainer = document.getElementById("Done-stories")!;
  if (!todoContainer || !doingContainer || !doneContainer) return;

  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const priorityOrder = { Low: 0, Medium: 1, High: 2 };
  const sortedStories = stories.sort((a, b) =>
    priorityOrder[b.priority] - priorityOrder[a.priority] || a.name.localeCompare(b.name)
  );

  const dragStart = (event: DragEvent, storyId: string) => {
    event.dataTransfer?.setData("text/plain", storyId);
  };

  for (const story of sortedStories) {
    const storyCard = await createStoryCard(story);
    if (!storyCard) continue;

    storyCard.id = story.id;
    storyCard.draggable = true;
    storyCard.addEventListener("dragstart", (event) => dragStart(event, story.id));

    const appendToContainer = (
      status: "Todo" | "Doing" | "Done",
      containerElement: HTMLElement
    ) => {
      if (story.status === status) {
        containerElement.appendChild(storyCard);
        storyCard.classList.remove("Doing", "Done", "Todo");
        storyCard.classList.add(status);
      }
    };

    appendToContainer("Todo", todoContainer);
    appendToContainer("Doing", doingContainer);
    appendToContainer("Done", doneContainer);
  }
}

export function editStory(story: Story): void {
  const modal = createEditStoryModal(story);
  document.body.appendChild(modal);
}

export async function deleteStory(id: string): Promise<void> {
  try {
    await projectAPI.deleteStory(id);
    await displayProjects();
  } catch (err) {
    console.error("Błąd usuwania story:", err);
  }
}

export async function showTasks(id: string): Promise<void> {
  const modal = await showModalWithTasksForStory(id);
  if (modal) {
    document.body.appendChild(modal);
  }
}

export async function addStory(event: Event): Promise<void> {
  event.preventDefault();
  const errorMessageField = document.getElementById("error-message")!;
  errorMessageField.textContent = "";

  if (!selectedProjectId) {
    errorMessageField.textContent = "No project selected.";
    return;
  }

  const modal = await createAddStoryModal(selectedProjectId);
  if (modal) {
    document.body.appendChild(modal);
  }
}
