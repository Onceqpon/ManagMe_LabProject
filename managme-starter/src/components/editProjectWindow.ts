import { createButton, createLabeledInputElement } from "./detailsComponent";
import { displayProjects } from "./projectManager";
import ProjectAPI from "../../managme-api/services/storageService";
import Project from "../../managme-api/model/projectModel";

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

  return modal;
}
