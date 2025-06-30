import ProjectAPI from "../managmeAPI/api";
import { StoryStatus } from "../models/storyModel";
import { displayStoriesForCurrentProject } from "./storyManagerUtils";

const projectAPI = new ProjectAPI();

export const drop = async (event: DragEvent, status: "Todo" | "Doing" | "Done"): Promise<void> => {
  event.preventDefault();

  const data = event.dataTransfer?.getData("text/plain");
  if (!data) return;

  const storyCard = document.getElementById(data);
  if (!storyCard) return;

  const story = await projectAPI.getStoryById(storyCard.id);
  if (!story) return;

  const newStatus = StoryStatus[status];
  if (story.status !== newStatus) {
    story.status = newStatus;
    await projectAPI.updateStory(story);
    await displayStoriesForCurrentProject(story.project_id);
  }

  const container = document.getElementById(`${status}-stories`);
  container?.classList.remove("drag-over");
};

export const dragOver = (event: DragEvent, status: string): void => {
  event.preventDefault();
  const container = document.getElementById(`${status}-stories`);
  container?.classList.add("drag-over");
};

export const dragLeave = (event: DragEvent, status: string): void => {
  event.preventDefault();
  const container = document.getElementById(`${status}-stories`);
  container?.classList.remove("drag-over");
};
