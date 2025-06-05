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

  const saveButton = createButton("Save", "modal-button", () => {
    const nameInputElement = nameEdit.querySelector("input");
    const descriptionInputElement = descriptionEdit.querySelector("input");
    project.name = nameInputElement ? nameInputElement.value : "";
    project.description = descriptionInputElement
      ? descriptionInputElement.value
      : "";
    projectAPI.updateProject(project);
    modal.remove();
    displayProjects();
  });

  const goBackButton = createButton("Go Back", "modal-button cancel", () =>
    modal.remove()
  );

  form.append(nameEdit, descriptionEdit);
  modalContent.append(form, saveButton, goBackButton);
  modal.appendChild(modalContent);

  // Pokazywanie modala
  document.body.appendChild(modal);
  modal.style.display = "block";

  return modal;
}
