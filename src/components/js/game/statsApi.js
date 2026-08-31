import { API_URL } from "../../utils/url.js";

export const statPost = async (
  userId,
  wpm,
  accuracy,
  language,
  difficulty,
  time_taken
) => {
  try {
    const token = localStorage.getItem("typing_game_token");
    const response = await fetch(`${API_URL}/stats/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wpm,
        accuracy,
        language,
        difficulty,
        time_taken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur when sending data :", data.message);
      return null;
    }

    console.log("Stat sent successfully:", data);

    const statSentSuccesToast = document.getElementById("toast-simple");
    statSentSuccesToast.classList.replace("hidden", "flex");

    setTimeout(() => {
      statSentSuccesToast.classList.replace("flex", "hidden");
    }, 2000);

    return data;
  } catch (error) {
    console.error("Network Error :", error);
    return null;
  }
};
