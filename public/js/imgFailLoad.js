function replaceWithErrorImage(image) {
  // Save the original src attribute value (external link)
  const originalSrc = image.src;

  // Replace the image source with the local image path
  image.src = "/images/blank photo.png";

  // Check if the image loads successfully from the external link
  image.onload = function () {
    // If the image loaded successfully, remove the onerror event handler
    image.onerror = null;
  };

  // If the image failed to load from the external link, reset the source to the local path
  image.onerror = function () {
    image.src = "/images/blank photo.png";
  };
}
