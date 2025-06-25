function toggleThemeIcon(themeIcon: HTMLElement | null, theme: string): void {
  if (!themeIcon) return;

  if (theme === "dark") {
    themeIcon.classList.replace("bi-moon", "bi-sun");
    themeIcon.textContent = " Light";
  } else {
    themeIcon.classList.replace("bi-sun", "bi-moon");
    themeIcon.textContent = " Dark";
  }
}

function setThemeStylesheet(theme: string): void {
  const themeStylesheet = document.getElementById("themeStylesheet") as HTMLLinkElement | null;
  if (!themeStylesheet) {
    console.error("Theme stylesheet element not found");
    return;
  }

  try {
    themeStylesheet.href = `./src/scss/${theme}Login.scss`;
  } catch (error) {
    console.error("Error loading theme stylesheet:", error);
  }
}

function getCurrentTheme(): string {
  return localStorage.getItem("theme") || "light";
}

function toggleTheme(): void {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  setThemeStylesheet(newTheme);
  localStorage.setItem("theme", newTheme);
  
  const themeIcon = document.getElementById("themeIcon");
  toggleThemeIcon(themeIcon, newTheme);
}

function initializeTheme(): void {
  const theme = getCurrentTheme();
  
  setThemeStylesheet(theme);
  
  const themeIcon = document.getElementById("themeIcon");
  toggleThemeIcon(themeIcon, theme);
  
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");
  toggleThemeBtn?.addEventListener("click", toggleTheme);
}

document.addEventListener("DOMContentLoaded", initializeTheme);