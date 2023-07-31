// Get the button element by its ID
const scrollTo = document.getElementById("scrollTo");

// Function to scroll to the top of the page
function scrollToTop() {
  // Scroll smoothly to the top of the page
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to check visibility and add the "active" class
function toggleScrollTo() {
  const scrollY = window.scrollY;

  if (scrollY > 3) {
    scrollTo.classList.add("active");
  } else {
    scrollTo.classList.remove("active");
  }
}

// Attach the scrollToTop function to the button's click event
scrollTo.addEventListener("click", scrollToTop);

// Attach the toggleScrollTo function to the scroll event
window.addEventListener("scroll", toggleScrollTo);
