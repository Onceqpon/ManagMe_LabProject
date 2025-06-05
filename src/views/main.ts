import {
  displayProjects,
  addProject,
  deselectAllProjects,
} from "../utils/projectManagerUtils";
import { addStory } from "../utils/storyManagerUtils";
import { dragLeave, dragOver, drop } from "../utils/dragAndDropUtils";
import UsersDB from "../db/users";
import { jwtDecode } from "jwt-decode";

export const currentUser = UsersDB.getAll()[0];

async function displayLoggedInUser() {
  await fetch("http://localhost:5000/api/userinfo", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Unauthorized") {
        window.location.href = "/";
      }
      console.log("User data:", data);
      const userNameSpan = document.getElementById("user-name");
      if (userNameSpan) {
        userNameSpan.textContent = data.user.name;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

const isTokenExpired = (token: string) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token available.");
    return null;
  }

  try {
    const response = await fetch("http://localhost:5000/api/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh access token.");
      return null;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);

    return data.token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}
async function makeApiCall() {
  let token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    console.log("Token expired. Refreshing...");
    token = await refreshAccessToken();
    console.log("New token:", token);
    if (!token) {
      console.error("Failed to refresh token. Redirecting to login.");
      window.location.href = "/";
      return;
    } else {
      displayLoggedInUser();
    }
  } else {
    displayLoggedInUser();
  }
}

window.onload = function () {
  makeApiCall();

  document.getElementById("logout-button")?.addEventListener("click", logout);

  deselectAllProjects();
  const addButton = document.getElementById("add-button");
  const addStoryButton = document.getElementById("add-story");

  addButton?.addEventListener("click", (event) => {
    event.preventDefault();
    addProject(event);
  });

  addStoryButton?.addEventListener("click", (event) => {
    event.preventDefault();
    addStory(event);
  });

  const todoContainer = document.getElementById("Todo-stories")!;
  const doingContainer = document.getElementById("Doing-stories")!;
  const doneContainer = document.getElementById("Done-stories")!;

  todoContainer.addEventListener("dragover", (event) =>
    dragOver(event, "Todo")
  );
  todoContainer.addEventListener("drop", (event) => drop(event, "Todo"));
  todoContainer.addEventListener("dragleave", (event) =>
    dragLeave(event, "Todo")
  );

  doingContainer.addEventListener("dragover", (event) =>
    dragOver(event, "Doing")
  );
  doingContainer.addEventListener("drop", (event) => drop(event, "Doing"));
  doingContainer.addEventListener("dragleave", (event) =>
    dragLeave(event, "Doing")
  );

  doneContainer.addEventListener("dragover", (event) =>
    dragOver(event, "Done")
  );
  doneContainer.addEventListener("drop", (event) => drop(event, "Done"));
  doneContainer.addEventListener("dragleave", (event) =>
    dragLeave(event, "Done")
  );

  displayProjects();
};
