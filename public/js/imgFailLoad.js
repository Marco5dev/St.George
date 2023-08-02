const blankImagePath = "/images/blank photo.png";

function replaceWithErrorImage(img) {
  // Check if the src attribute is empty.
  if (img.src === "") {
    // Set the src to the blank image path.
    img.src = blankImagePath;
  } else {
    // Check if the image failed to load.
    if (img.src = blankImagePath) {
      // Set the src to the blank image path.
      img.src = blankImagePath;
    }
  }
}

// Attach the onerror event listener to the image element.
img.addEventListener("error", replaceWithErrorImage);
