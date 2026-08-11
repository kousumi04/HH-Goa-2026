const scooterButton = document.querySelector(".scooter-button");
const uploadDialog = document.querySelector(".upload-dialog");
const uploadForm = document.querySelector(".upload-form");
const fileInput = document.querySelector('.file-field input[type="file"]');
const cancelButton = document.querySelector(".cancel-button");
const uploadedPhoto = document.querySelector(".uploaded-photo");

scooterButton?.addEventListener("click", () => {
  if (typeof uploadDialog?.showModal === "function") {
    uploadDialog.showModal();
    return;
  }

  fileInput?.click();
});

cancelButton?.addEventListener("click", () => {
  uploadDialog?.close();
});

uploadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!fileInput?.files?.length) {
    fileInput?.reportValidity();
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    sessionStorage.setItem("profilePhoto", String(reader.result));
    uploadDialog?.close();
    scooterButton?.classList.add("is-exiting");
  });

  reader.readAsDataURL(fileInput.files[0]);
});

scooterButton?.addEventListener("animationend", (event) => {
  if (event.animationName === "scooter-exit") {
    window.location.href = "agenda.html";
  }
});

if (uploadedPhoto) {
  const profilePhoto = sessionStorage.getItem("profilePhoto");

  if (profilePhoto) {
    uploadedPhoto.src = profilePhoto;
  } else {
    uploadedPhoto.remove();
  }
}
