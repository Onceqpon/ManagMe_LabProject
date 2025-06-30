import { Story } from "../models/storyModel";
import { editStory, deleteStory, showTasks } from "../utils/storyManagerUtils";
import UsersDB from "../db/users";
import ProjectAPI from "../managmeAPI/api";

const projectAPI = new ProjectAPI();

export function createButton(
  text: string,
  className: string,
  clickHandler: () => void | Promise<void>
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const result = clickHandler();
    if (result instanceof Promise) {
      result.catch((error) => console.error("Button handler error:", error));
    }
  });
  return button;
}

export function createLabeledInputElement(
  type: string,
  id: string,
  value: string,
  labelText: string
): HTMLElement {
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.value = value;

  const container = document.createElement("div");
  container.appendChild(label);
  container.appendChild(input);

  return container;
}

export function createLabeledOptionElement(
  id: string,
  options: string[],
  labelText: string,
  selectedOption?: string | null
): HTMLElement {
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const select = document.createElement("select");
  select.id = id;

  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.id = optionValue;
    option.textContent = optionValue;
    if (selectedOption === optionValue) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  const container = document.createElement("div");
  container.appendChild(label);
  container.appendChild(select);

  return container;
}

export async function createStoryCard(story: Story): Promise<HTMLDivElement> {
  const storyCard = document.createElement("div");
  storyCard.className = "story-card";

  const storyTitle = document.createElement("h2");
  storyTitle.textContent = story.name;
  storyCard.appendChild(storyTitle);

  const storyDescription = document.createElement("p");
  storyDescription.textContent = story.description;
  storyDescription.className = "story-description";
  storyCard.appendChild(storyDescription);

  const storyPriority = document.createElement("p");
  storyPriority.textContent = "Priority: " + story.priority;
  storyCard.appendChild(storyPriority);

  const storyStatus = document.createElement("p");
  storyStatus.textContent = "Status: " + story.status;
  storyCard.appendChild(storyStatus);

  const storyCreatedAt = document.createElement("p");
  const date = new Date(story.created_at);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;
  storyCreatedAt.textContent = "Created: " + formattedDate;
  storyCard.appendChild(storyCreatedAt);

  const storyOwner = document.createElement("p");
  try {
    const user = await UsersDB.getUserById(story.owner_id);
    storyOwner.textContent = "Author: " + (user?.name || "Unknown");
  } catch (error) {
    console.error("Error fetching user:", error);
    storyOwner.textContent = "Author: Unknown";
  }
  storyCard.appendChild(storyOwner);

  const taskAmount = document.createElement("p");
  try {
    const taskList = await projectAPI.getTasksByStoryId(story.id);
    taskAmount.textContent = "Tasks: " + (taskList?.length || 0);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    taskAmount.textContent = "Tasks: ?";
  }
  storyCard.appendChild(taskAmount);

  const editButton = createButton("Edit", "edit-story-button", async () => {
    await editStory(story);
  });

  const deleteButton = createButton("Delete", "delete-story-button", async () => {
    await deleteStory(story.id);
  });

  const showAllTasksForThisStory = createButton(
    "Show tasks",
    "show-tasks-button",
    async () => {
      await showTasks(story.id);
    }
  );

  storyCard.append(editButton, deleteButton, showAllTasksForThisStory);

  return storyCard;
}
