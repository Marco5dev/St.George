/**
 * Dark Mode & Light Mode
 */
const themeStylesheet = document.getElementById("themeStylesheet");
const container = document.getElementById("top");
const toggle = document.getElementById("color_mode");
const a = document.getElementById("color_mode2");

toggle.addEventListener("change", function () {
  if (toggle.checked) {
    container.classList.remove("light");
    container.classList.add("dark");
    themeStylesheet.href = "/css/dark.css";
  } else {
    container.classList.remove("dark");
    container.classList.add("light");
    themeStylesheet.href = "/css/light.css";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Get reference to the dark-mode-text element
  const darkModeText = document.querySelector(".dark-mode-text");

  // Add event listener to the dark-mode-text element
  darkModeText.addEventListener("click", function darkModeText() {
    // Toggle the checked state of checkbox2 (color_mode2)
    const checkbox2 = document.getElementById("color_mode2");
    const checkbox = document.getElementById("color_mode");
    checkbox2.checked = !checkbox2.checked;
    checkbox.checked = !checkbox.checked;

    // Manually trigger the change event on checkbox2 to update the dark mode
    const event = new Event("change");
    checkbox2.dispatchEvent(event);
    dark()
  });
});

function dark() {
  const a = document.getElementById("color_mode2");
  if (a.checked) {
    container.classList.remove("light");
    container.classList.add("dark");
    themeStylesheet.href = "/css/dark.css";
  } else {
    container.classList.remove("dark");
    container.classList.add("light");
    themeStylesheet.href = "/css/light.css";
  }
}

// Get references to the checkboxes
const checkbox1 = document.getElementById("color_mode");
const checkbox2 = document.getElementById("color_mode2");

// Add event listeners to both checkboxes
checkbox1.addEventListener("change", synchronizeCheckboxes);
checkbox2.addEventListener("change", synchronizeCheckboxes);

// Function to synchronize the checkboxes
function synchronizeCheckboxes(event) {
  // Get the checkbox that triggered the event
  const changedCheckbox = event.target;

  // If checkbox1 is the one that changed, update checkbox2 to match its state
  if (changedCheckbox === checkbox1) {
    checkbox2.checked = changedCheckbox.checked;
  }
  // If checkbox2 is the one that changed, update checkbox1 to match its state
  else if (changedCheckbox === checkbox2) {
    checkbox1.checked = changedCheckbox.checked;
  }
}

// Check if dark mode is preferred
function setDarkModePreference() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDarkMode) {
    container.classList.remove("light");
    container.classList.add("dark");
    themeStylesheet.href = "/css/dark.css";
  } else {
    container.classList.remove("dark");
    container.classList.add("light");
    themeStylesheet.href = "/css/light.css";
  }

  checkbox1.checked = isDarkMode;
  checkbox2.checked = isDarkMode;
}

// Call the function on page load
setDarkModePreference();

// Add a listener for changes in the system theme
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (event.matches) {
      container.classList.remove("light");
      container.classList.add("dark");
      themeStylesheet.href = "/css/dark.css";
    } else {
      container.classList.remove("dark");
      container.classList.add("light");
      themeStylesheet.href = "/css/light.css";
    }

    checkbox1.checked = event.matches;
    checkbox2.checked = event.matches;
  });
