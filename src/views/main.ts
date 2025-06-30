import {
  displayProjects,
  addProject,
  deselectAllProjects,
} from "../utils/projectManagerUtils";
import { addStory } from "../utils/storyManagerUtils";
import { dragLeave, dragOver, drop } from "../utils/dragAndDropUtils";
import { jwtDecode, JwtPayload } from "jwt-decode";

export let currentUser: { id: string; name: string } | null = null;

async function fetchLoggedInUser(): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const response = await fetch("http://localhost:5000/api/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.message === "Unauthorized" || !data.user) {
      window.location.href = "/";
      return;
    }

    currentUser = {
      id: data.user.id,
      name: data.user.name,
    };

    const userNameSpan = document.getElementById("user-name");
    if (userNameSpan) {
      userNameSpan.textContent = currentUser.name;
    }

    console.log("User data:", currentUser);
  } catch (error) {
    console.error("Error fetching user info:", error);
    window.location.href = "/";
  }
}

function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp !== undefined && decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await fetch("http://localhost:5000/api/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.token;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}

async function ensureAuthenticated(): Promise<void> {
  let token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
    if (!token) {
      logout();
      return;
    }
  }

  await fetchLoggedInUser();
}

window.onload = async () => {
  try {
    await ensureAuthenticated();

    document.getElementById("logout-button")?.addEventListener("click", logout);

    await deselectAllProjects(); // 🟢 TERAZ async
    await displayProjects();     // 🟢 TERAZ async

    document.getElementById("add-button")?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await addProject(e);
      } catch (err) {
        console.error("Error adding project:", err);
      }
    });

    document.getElementById("add-story")?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await addStory(e);
      } catch (err) {
        console.error("Error adding story:", err);
      }
    });

    const containers = ["Todo", "Doing", "Done"];
    containers.forEach((status) => {
      const container = document.getElementById(`${status}-stories`);
      if (!container) return;

      container.addEventListener("dragover", (e) => dragOver(e, status as any));
      container.addEventListener("drop", (e) => drop(e, status as any));
      container.addEventListener("dragleave", (e) => dragLeave(e, status as any));
    });
  } catch (error) {
    console.error("Unexpected error on init:", error);
    logout();
  }
};
