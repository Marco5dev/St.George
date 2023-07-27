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
    themeStylesheet.href = "./css/dark.css";
  } else {
    container.classList.remove("dark");
    container.classList.add("light");
    themeStylesheet.href = "./css/light.css";
  }
});

function dark() {
    const a = document.getElementById("color_mode2");
  if (a.checked) {
    container.classList.remove("light");
    container.classList.add("dark");
    themeStylesheet.href = "./css/dark.css";
  } else {
    container.classList.remove("dark");
    container.classList.add("light");
    themeStylesheet.href = "./css/light.css";
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
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  container.classList.remove("light");
  container.classList.add("dark");
  themeStylesheet.href = "./css/dark.css";
} else {
  container.classList.remove("dark");
  container.classList.add("light");
  themeStylesheet.href = "./css/light.css";
}
