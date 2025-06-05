import { Task } from "../models/taskModel";
import ProjectAPI from "../managmeAPI/api";
import {
  createEditTaskModal,
  createTaskModal,
  showModalWithTasksForStory,
} from "./taskModalUtils";

const projectAPI = new ProjectAPI();

export function editTask(task: Task): void {
  const modal = createEditTaskModal(task);
  if (modal) {
    document.body.appendChild(modal);
  }
}

export function deleteTask(taskId: string, storyId: string): void {
  // 1. Delete the task using API
  projectAPI.deleteTask(taskId);

  // 2. Remove the existing modal (task list modal)
  const existingModal = document.querySelector('.modal');
  if (existingModal) {
    existingModal.remove();
  }

  // 3. Call the function to show the updated task list
  showModalWithTasksForStory(storyId); // This should show the updated task list after deletion
}

export function createTask(storyId: string): void {
  const modal = createTaskModal(storyId);
  if (modal) {
    document.body.appendChild(modal);
  }
}
