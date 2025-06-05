import { Story } from "../models/storyModel";
import { editStory, deleteStory, showTasks } from "../utils/storyManagerUtils";
import UsersDB from "../db/users";

/**
 * Function to create a button element with a specific click handler.
 * @param text - The text to display on the button.
 * @param className - The CSS class for the button.
 * @param clickHandler - The click event handler.
 * @returns The button element.
 */
export function createButton(
  text: string,
  className: string,
  clickHandler: () => void
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", clickHandler); // Ensure the event listener is properly added.
  return button;
}

/**
 * Function to create a labeled input element.
 * @param type - The type of input (e.g., "text", "number").
 * @param id - The ID of the input element.
 * @param value - The value of the input element.
 * @param labelText - The label text for the input.
 * @returns The labeled input element.
 */
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

/**
 * Function to create a labeled select (dropdown) element.
 * @param id - The ID of the select element.
 * @param options - The options for the select dropdown.
 * @param labelText - The label text for the select element.
 * @param selectedOption - The selected option (optional).
 * @returns The labeled select element.
 */
export function createLabeledOptionElement(
  id: string,
  options: string[],
  labelText: string,
  selectedOption: string | null = null
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

/**
 * Function to create a story card displaying story details.
 * @param story - The story object to create the card for.
 * @returns The story card element.
 */
export function createStoryCard(story: Story): HTMLDivElement {
  const storyCard = document.createElement("div");
  storyCard.className = "story-card";

  // Story title
  const storyTitle = document.createElement("h2");
  storyTitle.textContent = story.name;
  storyCard.appendChild(storyTitle);

  // Story description
  const storyDescription = document.createElement("p");
  storyDescription.textContent = story.description;
  storyDescription.className = "story-description";
  storyCard.appendChild(storyDescription);

  // Story priority
  const storyPriority = document.createElement("p");
  storyPriority.textContent = `Priority: ${story.priority}`;
  storyCard.appendChild(storyPriority);

  // Story status
  const storyStatus = document.createElement("p");
  storyStatus.textContent = `Status: ${story.status}`;
  storyCard.appendChild(storyStatus);

  // Story created date
  const storyCreatedAt = document.createElement("p");
  const date = new Date(story.createdAt);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;
  storyCreatedAt.textContent = `Created: ${formattedDate}`;
  storyCard.appendChild(storyCreatedAt);

  // Story owner (author)
  const storyOwner = document.createElement("p");
  const author = UsersDB.getUserById(story.owner);
  storyOwner.textContent = `Author: ${author ? author.name : "Unknown"}`;
  storyCard.appendChild(storyOwner);

  // Story task count
  const taskAmount = document.createElement("p");
  taskAmount.textContent = `Tasks: ${story.tasks.length}`;
  storyCard.appendChild(taskAmount);

  // Action buttons (Edit, Delete, Show Tasks)
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
  
  // Append action buttons to story card
  storyCard.append(editButton, deleteButton, showAllTasksForThisStory);

  // Log the story card (for debugging purposes)
  console.log(storyCard);
  
  return storyCard;
}
