import { Task } from "../models/taskModel";
import ProjectAPI from "../managmeAPI/api";
import {
  createEditTaskModal,
  createTaskModal,
  showModalWithTasksForStory,
} from "./taskModalUtils";

const projectAPI = new ProjectAPI();

export async function editTask(task: Task): Promise<void> {
  const modal = await createEditTaskModal(task);
  if (modal) {
    document.body.appendChild(modal);
  }
}

export async function deleteTask(taskId: string, storyId: string): Promise<void> {
  await projectAPI.deleteTask(taskId);
  await showModalWithTasksForStory(storyId);
}

export async function createTask(storyId: string): Promise<void> {
  const modal = await createTaskModal(storyId);
  if (modal) {
    document.body.appendChild(modal);
  }
}
