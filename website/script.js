const scooterButton = document.querySelector(".scooter-button");
const uploadDialog = document.querySelector(".upload-dialog");
const uploadForm = document.querySelector(".upload-form");
const fileInput = document.querySelector('.file-field input[type="file"]');
const cancelButton = document.querySelector(".cancel-button");

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

  uploadDialog?.close();
  scooterButton?.classList.add("is-exiting");
});
