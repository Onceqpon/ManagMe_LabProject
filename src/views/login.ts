interface LoginResponse {
  token: string;
  refreshToken: string;
  message?: string;
}

async function handleLogin(event: Event): Promise<void> {
  event.preventDefault();

  const login = (document.getElementById("login") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password }),
  });

  const data: LoginResponse = await response.json();

  const { token, refreshToken } = data;

  if (response.ok) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    window.location.href = "/projectManager";
  } else {
    alert("Błąd logowania: " + data.message);
  }
}

function checkForJwtOnLoad() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/projectManager";
  }
}

document.getElementById("login-form")?.addEventListener("submit", handleLogin);

document.addEventListener("DOMContentLoaded", checkForJwtOnLoad);
