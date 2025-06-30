import { Task, TaskPriority, TaskStatus } from "../models/taskModel";
import ProjectAPI from "../managmeAPI/api";
import {
  createButton,
  createLabeledInputElement,
  createLabeledOptionElement,
} from "./domUtils";
import { editTask, deleteTask } from "./taskManagerUtils";
import { displayStoriesForCurrentProject } from "./storyManagerUtils";
import { selectedProjectId } from "./projectManagerUtils";

const projectAPI = new ProjectAPI();

// 🟢 MODAL DO EDYCJI
export async function createEditTaskModal(task: Task): Promise<HTMLDivElement> {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const form = document.createElement("form");
  form.id = "edit-task-form";

  const nameEdit = createLabeledInputElement("text", "task-input", task.name, "Name: ");
  const descriptionEdit = createLabeledInputElement("text", "task-input", task.description, "Description: ");
  const statusEdit = createLabeledOptionElement("task-status", ["Todo", "Doing", "Done"], "Status: ", task.status);
  const priorityEdit = createLabeledOptionElement("task-priority", ["Low", "Medium", "High"], "Priority: ", task.priority);
  const estimatedTimeEdit = createLabeledInputElement("number", "estimated-time", task.estimated_time.toString(), "Estimated Time: ");

  const users = await projectAPI.getAllUsers();
  const userOptions = [{ name: "Select a user", id: -1 }, ...users];
  const selectedUserName = task.assigned_user_id
    ? users.find((u) => u.id === task.assigned_user_id)?.name || "Select a user"
    : "Select a user";

  const assignedUserSelect = createLabeledOptionElement(
    "assigned-user",
    userOptions.map((u) => u.name),
    "Assign User: ",
    selectedUserName
  );

  const saveButton = createButton("Save", "modal-button", async () => {
    const nameInputElement = nameEdit.querySelector("input");
    const descriptionInputElement = descriptionEdit.querySelector("input");
    const statusValue = statusEdit.querySelector("select")?.value as TaskStatus;
    const priorityValue = priorityEdit.querySelector("select")?.value as TaskPriority;
    const estimatedTimeValue = parseInt(estimatedTimeEdit.querySelector("input")?.value || "0");

    task.name = nameInputElement?.value || task.name;
    task.description = descriptionInputElement?.value || task.description;
    task.status = statusValue;
    task.priority = priorityValue;
    task.estimated_time = estimatedTimeValue;

    if (statusValue === "Done") {
      task.end_at = new Date();
    } else {
      task.end_at = undefined;
    }

    const assignedUserValue = (document.getElementById("assigned-user") as HTMLSelectElement)?.value;
    if (assignedUserValue && assignedUserValue !== "Select a user") {
      const user = users.find((user) => user.name === assignedUserValue);
      if (user) {
        task.assigned_user_id = user.id;
        if (statusValue !== "Done" && statusValue !== "Doing") {
          task.start_at = new Date();
          task.status = TaskStatus.Doing;
        }
      }
    } else {
      task.assigned_user_id = undefined;
      task.start_at = undefined;
      if (statusValue !== "Done") {
        task.status = TaskStatus.Todo;
      }
    }

    await projectAPI.updateTask(task);
    modal.remove();
    await showModalWithTasksForStory(task.story_id);
  });

  const goBackButton = createButton("Go Back", "modal-button cancel", async () => {
    modal.remove();
    await showModalWithTasksForStory(task.story_id);
  });

  form.append(nameEdit, descriptionEdit, statusEdit, priorityEdit, estimatedTimeEdit, assignedUserSelect);
  modalContent.append(form, saveButton, goBackButton);
  modal.appendChild(modalContent);

  return modal;
}

// 🟢 MODAL DO TWORZENIA
export async function createTaskModal(storyId: string): Promise<HTMLDivElement> {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const form = document.createElement("form");
  form.id = "edit-task-form";

  const name = createLabeledInputElement("text", "task-name", "", "Name: ");
  const description = createLabeledInputElement("text", "task-description", "", "Description: ");
  const priority = createLabeledOptionElement("task-priority", ["Low", "Medium", "High"], "Priority: ");
  const estimatedTime = createLabeledInputElement("number", "estimated-time", "", "Estimated Time: ");

  const addTaskButton = createButton("Add Task", "modal-button", async () => {
    const nameValue = name.querySelector("input")?.value;
    const descriptionValue = description.querySelector("input")?.value;
    const priorityValue = priority.querySelector("select")?.value as keyof typeof TaskPriority;
    const estimatedTimeValue = parseInt(estimatedTime.querySelector("input")?.value || "0", 10);

    if (nameValue && descriptionValue && priorityValue && selectedProjectId !== null) {
      const taskId = crypto.randomUUID();
      const newTask = new Task(taskId, nameValue, descriptionValue, TaskPriority[priorityValue], storyId, selectedProjectId, estimatedTimeValue);

      newTask.start_at = new Date();
      newTask.status = TaskStatus.Todo;

      await projectAPI.createTask(storyId, newTask);
      modal.remove();
      await showModalWithTasksForStory(storyId);
    }
  });

  const goBackButton = createButton("Go Back", "modal-button cancel", async () => {
    modal.remove();
    await showModalWithTasksForStory(storyId);
  });

  form.append(name, description, priority, estimatedTime);
  modalContent.append(form, addTaskButton, goBackButton);
  modal.appendChild(modalContent);

  return modal;
}

// 🟢 MODAL Z LISTĄ ZADAŃ
export async function showModalWithTasksForStory(storyId: string): Promise<HTMLDivElement> {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.id = "task-modal-content";
  modalContent.className = "task-modal-content";

  const tasks = await projectAPI.getTasksByStoryId(storyId);

  if (!tasks || tasks.length === 0) {
    const noTasksMessage = document.createElement("p");
    noTasksMessage.textContent = "No tasks for this story";
    modalContent.appendChild(noTasksMessage);
  } else {
    const existingTable = document.getElementById("task-table");
    if (existingTable) existingTable.remove();

    const table = document.createElement("table");
    table.id = "task-table";

    const headerRow = table.insertRow();
    ["Title", "Priority", "Status", "Estimated Time", "Created At", "Assignee", "Start At", "End At", "Actions"].forEach((headerText) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
    });

    for (const task of tasks) {
      const row = table.insertRow();
      row.id = task.id;

      const nameCell = row.insertCell();
      nameCell.innerHTML = `<strong>${task.name}</strong>`;

      const priorityCell = row.insertCell();
      priorityCell.textContent = task.priority;
      priorityCell.style.color = task.priority === TaskPriority.High ? "red" : task.priority === TaskPriority.Medium ? "orange" : "green";
      priorityCell.style.fontWeight = "bold";

      const statusCell = row.insertCell();
      statusCell.textContent = task.status;
      statusCell.style.color = task.status === TaskStatus.Doing ? "blue" : task.status === TaskStatus.Done ? "green" : "black";
      statusCell.style.fontWeight = "bold";

      const estimatedTimeCell = row.insertCell();
      estimatedTimeCell.textContent = task.estimated_time.toString();

      const createdAtCell = row.insertCell();
      createdAtCell.textContent = new Date(task.created_at).toLocaleDateString();

      const assigneeCell = row.insertCell();
      const assignedUser = task.assigned_user_id ? await projectAPI.getUserById(task.assigned_user_id) : undefined;
      assigneeCell.textContent = assignedUser ? assignedUser.name : "Unassigned";

      const startAtCell = row.insertCell();
      startAtCell.textContent = task.start_at ? new Date(task.start_at).toLocaleDateString() : "Not started";

      const endAtCell = row.insertCell();
      endAtCell.textContent = task.end_at ? new Date(task.end_at).toLocaleDateString() : "Not completed";

      const actionsCell = row.insertCell();
      actionsCell.appendChild(createButton("Edit", "modal-button active", async () => {
        const editModal = await createEditTaskModal(task);
        modal.remove();
        document.body.appendChild(editModal);
      }));
      actionsCell.appendChild(createButton("Delete", "modal-button cancel", async () => {
        await projectAPI.deleteTask(task.id);
        modal.remove();
        await showModalWithTasksForStory(storyId);
      }));
    }

    modalContent.appendChild(table);
  }

  const createTaskButton = createButton("Create Task", "modal-button active", async () => {
    const createModal = await createTaskModal(storyId);
    document.body.appendChild(createModal);
    modal.remove();
  });

  modalContent.appendChild(createTaskButton);

  const goBackButton = createButton("Go Back", "modal-button cancel", async () => {
    modal.remove();
    await displayStoriesForCurrentProject(selectedProjectId!);
  });

  modalContent.appendChild(goBackButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  return modal;
}
