import { createButton, createLabeledInputElement } from "./domUtils";
import { displayProjects } from "./projectManagerUtils";
import ProjectAPI from "../managmeAPI/api";
import Project from "../models/projectModel";

const projectAPI = new ProjectAPI();

export function createEditProjectModal(project: Project): HTMLDivElement {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const form = document.createElement("form");
  form.id = "edit-project-form";

  const nameEdit = createLabeledInputElement(
    "text",
    "project-input",
    project.name,
    "Name: "
  );
  const descriptionEdit = createLabeledInputElement(
    "text",
    "project-input",
    project.description,
    "Description: "
  );

  const saveButton = createButton("Save", "modal-button", async () => {
    const nameInputElement = nameEdit.querySelector("input");
    const descriptionInputElement = descriptionEdit.querySelector("input");

    const nameValue = nameInputElement?.value.trim() || "";
    const descriptionValue = descriptionInputElement?.value.trim() || "";

    project.name = nameValue;
    project.description = descriptionValue;

    try {
      await projectAPI.updateProject(project);
      modal.remove();
      await displayProjects();
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("There was an error saving the project. Please try again.");
    }
  });

  const goBackButton = createButton("Go Back", "modal-button cancel", () => {
    modal.remove();
  });

  // zapobiegnie odświeżaniu formularza po kliknięciu Enter
  form.addEventListener("submit", (e) => e.preventDefault());

  form.append(nameEdit, descriptionEdit);
  modalContent.append(form, saveButton, goBackButton);
  modal.appendChild(modalContent);

  return modal;
}
