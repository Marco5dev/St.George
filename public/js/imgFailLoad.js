// JavaScript to handle the error for all image tags
document.addEventListener("DOMContentLoaded", function () {
  const imageContainers = document.querySelectorAll(".image-container");

  imageContainers.forEach(function (container) {
    const image = container.querySelector("img");
    const errorImage = new Image();
    errorImage.src = "/images/blank photo.png";

    image.addEventListener("load", function () {
      // Image loaded successfully, show the image and resize the container to fit the image
      container.style.width = image.width + "px";
      container.style.height = image.height + "px";
    });

    image.addEventListener("error", function () {
      // Image failed to load, replace it with the error image and resize the container
      image.style.display = "none"; // Hide the original image
      container.appendChild(errorImage);
      container.style.width = errorImage.width + "px";
      container.style.height = errorImage.height + "px";
    });
  });
});

function replaceWithErrorImage(image) {
  // Define the URL of the replacement image here
  const replacementImageUrl = "/images/blank photo.png";
  image.src = replacementImageUrl;
}
