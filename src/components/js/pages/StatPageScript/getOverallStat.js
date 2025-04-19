import { API_URL } from "../../../../utils/url.js";

const avgWpm = document.querySelectorAll("#avg-wpm");
const avgAcc = document.querySelectorAll("#avg-accuracy");
const maxWpm = document.querySelector("#max-wpm");
const totalTest = document.querySelectorAll("#complete-test");
const leaderboardAvgWpm = document.querySelector("#leaderboard-avg-wpm");
const leaderboardAvgAccuracy = document.querySelector(
  "#leaderboard-avg-accuracy"
);
const token = localStorage.getItem("typing_game_token");

const displayDefaultValues = () => {
  avgAcc.forEach((field) => {
    field.textContent = "-";
  });
  avgWpm.forEach((field) => {
    field.textContent = "-";
  });
  maxWpm.textContent = "-";
  totalTest.forEach((field) => (field.textContent = "-"));
  leaderboardAvgWpm.textContent = "-";
  leaderboardAvgAccuracy.textContent = "-";
};

const renderOverallStat = async () => {
  const user = JSON.parse(localStorage.getItem("typing_game_user"));

  if (!user?.id) {
    console.warn("No user ID found in localStorage.");
    displayDefaultValues();
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${API_URL}/stats/global/${user.id}`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("Global Stats:", data);

    const { total_test, max_wpm, avg_wpm, avg_accuracy } = data[0] || {};

    avgAcc.forEach((field) => {
      field.textContent = `${Number(avg_accuracy).toFixed(1)}%`;
    });
    avgWpm.forEach((field) => {
      field.textContent = `${Number(avg_wpm).toFixed(1)} wpm`;
    });
    maxWpm ? (maxWpm.textContent = max_wpm) : null;

    totalTest.forEach((field) => (field.textContent = total_test));

    if (leaderboardAvgAccuracy)
      leaderboardAvgAccuracy.textContent = `${Number(avg_accuracy).toFixed(1)}%`;
    if (leaderboardAvgWpm)
      leaderboardAvgWpm.textContent = `${Number(avg_wpm).toFixed(1)} wpm`;
  } catch (err) {
    console.error("Failed to fetch global stats:", err);
    displayDefaultValues();
  }
};

renderOverallStat();
