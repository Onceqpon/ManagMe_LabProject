import { jwtDecode } from "jwt-decode";

interface LoginResponse {
  token: string;
  refreshToken: string;
  message?: string;
}

interface DecodedToken {
  exp: number;
}

async function handleLogin(event: Event): Promise<void> {
  event.preventDefault();

  const loginInput = document.getElementById("login") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;

  if (!loginInput || !passwordInput) {
    alert("Brakuje pól logowania.");
    return;
  }

  const login = loginInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    const data: LoginResponse = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/projectManager";
    } else {
      alert("Błąd logowania: " + (data.message ?? "Nieznany błąd"));
    }
  } catch (error) {
    console.error("Błąd połączenia:", error);
    alert("Błąd sieci. Spróbuj ponownie później.");
  }
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

function checkForJwtOnLoad(): void {
  const token = localStorage.getItem("token");
  if (token && isTokenValid(token)) {
    window.location.href = "/projectManager";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkForJwtOnLoad();
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
});
