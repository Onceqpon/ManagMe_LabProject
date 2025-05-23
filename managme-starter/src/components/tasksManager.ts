import { Task } from "../../managme-api/model/taskModel";
import ProjectAPI from "../../managme-api/services/storageService";
import {
  createEditTaskModal,
  createTaskModal,
  showModalWithTasksForStory,
} from "./editTasksWindow";

const projectAPI = new ProjectAPI();

export function editTask(task: Task): void {
  const modal = createEditTaskModal(task);
  if (modal) {
    document.body.appendChild(modal);
  }
}

export function deleteTask(taskId: string, storyId: string): void {
  projectAPI.deleteTask(taskId);
  showModalWithTasksForStory(storyId);
}

export function createTask(storyId: string): void {
  const modal = createTaskModal(storyId);
  if (modal) {
    document.body.appendChild(modal);
  }
}
