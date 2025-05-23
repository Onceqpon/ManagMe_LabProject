import { Story } from "../../managme-api/model/storyModel";
import { editStory, deleteStory, showTasks } from "./storiesManager";
import UsersDB from "../../managme-api/db/users";

export function createButton(
  text: string,
  className: string,
  clickHandler: () => void
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", clickHandler);
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

export function createStoryCard(story: Story): HTMLDivElement {
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
  const date = new Date(story.createdAt);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;
  storyCreatedAt.textContent = "Created: " + formattedDate;
  storyCard.appendChild(storyCreatedAt);

  const storyOwner = document.createElement("p");
  storyOwner.textContent = "Author: " + UsersDB.getUserById(story.owner)?.name;
  storyCard.appendChild(storyOwner);

  const taskAmount = document.createElement("p");
  taskAmount.textContent = "Tasks: " + story.tasks.length;
  storyCard.appendChild(taskAmount);

  const editButton = createButton("Edit", "edit-story-button", () =>
    editStory(story)
  );
  const deleteButton = createButton("Delete", "delete-story-button", () =>
    deleteStory(story.id)
  );
  const showAllTasksForThisStory = createButton(
    "Show tasks",
    "show-tasks-button",
    () => showTasks(story.id)
  );
  storyCard.append(editButton, deleteButton, showAllTasksForThisStory);
  console.log(storyCard);
  return storyCard;
}
