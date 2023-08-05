const blankImagePath = "/images/blank-photo.png";

function replaceWithErrorImage(img) {
  // Check if the src attribute is empty.
  if (img.src === "") {
    // Set the src to the blank image path.
    img.src = blankImagePath;
  }
  img.src = blankImagePath;
}

// let img = replaceWithErrorImage(img);
// Attach the onerror event listener to the image element.
// img.addEventListener("error", replaceWithErrorImage);
