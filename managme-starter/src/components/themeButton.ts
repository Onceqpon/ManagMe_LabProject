function toggleThemeIcon(themeIcon: HTMLElement, theme: string) {
  if (theme === "dark") {
    themeIcon?.classList.add("bi-sun");
    themeIcon?.classList.remove("bi-moon");
    if (themeIcon !== null) {
      themeIcon.textContent = "Light";
    }
  } else {
    themeIcon?.classList.add("bi-moon");
    themeIcon?.classList.remove("bi-sun");
    if (themeIcon !== null) {
      themeIcon.textContent = "Dark";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const themeStylesheet = document.getElementById("themeStylesheet");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");
  const toggleIcon = document.getElementById("themeIcon");

  const currentTheme = localStorage.getItem("theme") || "light";
  themeStylesheet?.setAttribute("href", `./src/scss/${currentTheme}.scss`);

  if (toggleIcon !== null) {
    toggleThemeIcon(toggleIcon, currentTheme);
  }

  if (themeStylesheet !== null && toggleThemeBtn !== null) {
    toggleThemeBtn.addEventListener("click", function () {
      const theme = themeStylesheet?.getAttribute("href")?.includes("light")
        ? "dark"
        : "light";

      themeStylesheet.setAttribute("href", `./src/scss/${theme}.scss`);
      if (toggleIcon !== null) {
        toggleThemeIcon(toggleIcon, theme);
      }

      localStorage.setItem("theme", theme);
    });
  }
});
