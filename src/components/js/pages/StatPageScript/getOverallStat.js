import { API_URL } from '../login.js';

const avgWpm = document.querySelectorAll('#avg-wpm');
const avgAcc = document.querySelectorAll('#avg-accuracy');
const maxWpm = document.querySelector('#max-wpm');
const totalTest = document.querySelector('#complete-test');
const leaderboardAvgWpm = document.querySelector('#leaderboard-avg-wpm');
const leaderboardAvgAccuracy = document.querySelector(
  '#leaderboard-avg-accuracy',
);

const displayDefaultValues = () => {
  avgAcc.forEach((field) => {
    field.textContent = '-';
  });
  avgWpm.forEach((field) => {
    field.textContent = '-';
  });
  maxWpm.textContent = '-';
  totalTest.textContent = '-';
  leaderboardAvgWpm.textContent = '-';
  leaderboardAvgAccuracy.textContent = '-';
};

const renderOverallStat = async () => {
  const user = JSON.parse(localStorage.getItem('typing_game_user'));

  if (!user?.id) {
    console.warn('No user ID found in localStorage.');
    displayDefaultValues();
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_URL}/stats/global/${user.id}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log('Global Stats:', data);

    const { total_test, max_wpm, avg_wpm, avg_accuracy } = data[0] || {};

    if (avgWpm && avgAcc && maxWpm && totalTest) {
      avgAcc.forEach((field) => {
        field.textContent = `${Number(avg_accuracy).toFixed(1)}%`;
      });
      avgWpm.forEach((field) => {
        field.textContent = `${Number(avg_wpm).toFixed(1)} wpm`;
      });
      maxWpm.textContent = max_wpm;
      totalTest.textContent = total_test;
    } else {
      console.warn('Some DOM elements are missing');
      displayDefaultValues();
    }
  } catch (err) {
    console.error('Failed to fetch global stats:', err);
    displayDefaultValues();
  }
};

renderOverallStat();
