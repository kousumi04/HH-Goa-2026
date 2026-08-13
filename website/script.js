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

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!fileInput?.files?.length) {
    fileInput?.reportValidity();
    return;
  }

  let file = fileInput.files[0];

  // Intercept and convert HEIC formats
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    try {
      // heic2any requires the script tag added to the HTML
      const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
      file = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      alert("Failed to process HEIC file. Please try a different image.");
      return;
    }
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    sessionStorage.setItem("profilePhoto", String(reader.result));
    uploadDialog?.close();
    scooterButton?.classList.add("is-exiting");
  });

  reader.readAsDataURL(file);
});

scooterButton?.addEventListener("animationend", (event) => {
  if (event.animationName === "scooter-exit") {
    window.location.href = "agenda.html";
  }
});

// --- Final Page (Agenda) Logic ---
if (uploadedPhoto) {
  const profilePhoto = sessionStorage.getItem("profilePhoto");

  if (profilePhoto) {
    uploadedPhoto.src = profilePhoto;
  } else {
    uploadedPhoto.remove();
  }

  // Download & Share functionalities
  const profileCard = document.querySelector(".profile-card");
  const xButton = document.querySelector('img[alt="X"]');
  
  const socialIcons = document.querySelectorAll(".social-icons img");
  const downloadIcon = socialIcons.length > 1 ? socialIcons[1] : null;

  // Rasterize DOM composite to image
  const generateFinalImage = async () => {
    if (typeof html2canvas !== 'undefined') {
      const canvas = await html2canvas(profileCard, {
        backgroundColor: null, 
        scale: 2, 
        scrollX: 0, // Prevents offset bugs from horizontal scrolling
        scrollY: 0, // Prevents offset bugs from vertical scrolling
        useCORS: true // Standard practice to prevent tainted canvas errors
      });
      return canvas.toDataURL("image/png");
    }
    console.error("html2canvas library is missing.");
    return null;
  };

  // Bind Download logic to the existing icon
  if (downloadIcon && profileCard) {
    downloadIcon.style.cursor = "pointer";
    downloadIcon.addEventListener("click", async () => {
      const dataUrl = await generateFinalImage();
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = "hacker-house-goa.png";
        link.href = dataUrl;
        link.click();
      }
    });
  }

  // X (Twitter) Share binding
  if (xButton) {
    xButton.style.cursor = "pointer";
    xButton.addEventListener("click", async () => {
      const tweetText = "I am building for Hacker House Goa @247pmstudio\n#FameInGoa";
      const xWindow = window.open("", "_blank");

      try {
        const dataUrl = await generateFinalImage();

        if (!dataUrl) {
          xWindow?.close();
          return;
        }

        const uploadResponse = await fetch("/api/create-share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl })
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { shareUrl } = await uploadResponse.json();
        const xUrl =
          `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}` +
          `&url=${encodeURIComponent(shareUrl)}`;

        if (xWindow) {
          xWindow.location.href = xUrl;
        } else {
          window.location.href = xUrl;
        }
      } catch (error) {
        console.error("Could not prepare X share:", error);
        xWindow?.close();
        alert("Could not prepare the image for sharing. Please try again.");
      }
    });
  }
}
