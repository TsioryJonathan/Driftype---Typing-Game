import { API_URL } from "../../../../utils/url.js";

const bioText = document.getElementById("bio-text");
const editBtn = document.getElementById("edit-bio-btn");
const bioModal = document.getElementById("bio-modal");
const bioInput = document.getElementById("bio-input");
const cancelBtn = document.getElementById("cancel-bio-btn");
const saveBtn = document.getElementById("save-bio-btn");

window.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("typing_game_user")) {
    console.error("User not logged in");
    bioText.textContent = "";
    return;
  } else {
    const { id } = JSON.parse(localStorage.getItem("typing_game_user"));
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
  if (!localStorage.getItem("typing_game_user")) {
    console.error("User not logged in");
    return;
  }
  const { id } = JSON.parse(localStorage.getItem("typing_game_user"));
  const newBio = bioInput.value.trim();
  const token = localStorage.getItem("typing_game_token");

  if (!newBio) {
    bioText.textContent = "";
    bioModal.classList.replace("flex", "hidden");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/user/bio/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio: newBio }),
    });

    if (!res.ok) throw new Error("Failed to update bio");

    bioText.textContent = newBio;
    bioModal.classList.replace("flex", "hidden");
  } catch (err) {
    console.error(err);
  }
});

// fetch the bio

const fetchUserBio = async (userId) => {
  const token = localStorage.getItem("typing_game_token");
  try {
    const response = await fetch(`${API_URL}/user/bio/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bio: ${response.status}`);
    }

    const data = await response.json();
    return data.bio || "";
  } catch (error) {
    console.error("Error fetching user bio:", error);
    return "";
  }
};
