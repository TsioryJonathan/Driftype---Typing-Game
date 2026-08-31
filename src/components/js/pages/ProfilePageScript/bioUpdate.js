import { getUser } from "../../../../utils/auth.js";
import { apiGet, apiPost } from "../../../../utils/api.js";

const bioText = document.getElementById("bio-text");
const editBtn = document.getElementById("edit-bio-btn");
const bioModal = document.getElementById("bio-modal");
const bioInput = document.getElementById("bio-input");
const cancelBtn = document.getElementById("cancel-bio-btn");
const saveBtn = document.getElementById("save-bio-btn");

window.addEventListener("DOMContentLoaded", async () => {
  if (!getUser()) {
    console.error("User not logged in");
    bioText.textContent = "";
    return;
  } else {
    const { id } = getUser();
    bioText.textContent = await fetchUserBio(id);
  }
});

// Open modal
editBtn.addEventListener("click", () => {
  bioInput.value = bioText.textContent.trim();
  bioModal.classList.replace("hidden", "flex");
});

// Close modal
cancelBtn.addEventListener("click", () => {
  bioModal.classList.replace("flex", "hidden");
});

// Save the bio
saveBtn.addEventListener("click", async () => {
  if (!getUser()) {
    console.error("User not logged in");
    return;
  }
  const { id } = getUser();
  const newBio = bioInput.value.trim();

  if (!newBio) {
    bioText.textContent = "";
    bioModal.classList.replace("flex", "hidden");
    return;
  }

  try {
    await apiPost(`/user/bio/${id}`, { bio: newBio });

    bioText.textContent = newBio;
    bioModal.classList.replace("flex", "hidden");
  } catch (err) {
    console.error(err);
  }
});

// fetch the bio

const fetchUserBio = async (userId) => {
  try {
    const data = await apiGet(`/user/bio/${userId}`);
    return data.bio || "";
  } catch (error) {
    console.error("Error fetching user bio:", error);
    return "";
  }
};
