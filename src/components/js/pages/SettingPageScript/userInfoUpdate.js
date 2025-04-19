import { API_URL } from "../../../../utils/url.js";

const setLoadingState = (button, isLoading) => {
  if (!button) return;

  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? `
  
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-[var(--color-text)] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Loading...
`
    : `  <i class="fas fa-save text-white"></i>
            <span>Save Changes</span>
        `;
};

const showSuccessToast = () => {
  const toast = document.getElementById("toast-success");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, 1500);
};

const { id } = JSON.parse(localStorage.getItem("typing_game_user"));
const updateBtn = document.getElementById("user-info-update-btn");

const updateUserInfo = async (e) => {
  e.preventDefault();
  const username = document.querySelector("#username-input").value.trim();
  const email = document.querySelector("#email").value.trim();
  const savedData = JSON.parse(localStorage.getItem("typing_game_user"));
  const token = localStorage.getItem("typing_game_token");

  setLoadingState(updateBtn, true);
  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return;
    }

    const data = await response.json();

    savedData.username = data.user.username;
    savedData.email = data.user.email;
    localStorage.setItem("typing_game_user", JSON.stringify(savedData));

    setLoadingState(updateBtn, false);
    showSuccessToast();
  } catch (error) {
    console.log(error);
  }
};

updateBtn.addEventListener("click", updateUserInfo);
