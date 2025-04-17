import { API_URL } from '../login.js';

const avgWpm = document.querySelector('#avg-wpm');
const avgAcc = document.querySelector('#avg-accuracy');
const maxWpm = document.querySelector('#max-wpm');
const totalTest = document.querySelector('#complete-test');

const renderOverallStat = async () => {
  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));

  try {
    const res = await fetch(`${API_URL}/stats/global/${id}`);

    const data = await res.json();

    console.log(data);

    const { total_test, max_wpm, avg_wpm, avg_accuracy } = data[0];

    avgWpm.textContent = Number(avg_wpm).toFixed(2) + ' wpm';
    avgAcc.textContent = Number(avg_accuracy).toFixed(2) + '%';
    maxWpm.textContent = max_wpm;
    totalTest.textContent = total_test;
  } catch (err) {
    console.log(err);
  }
};

renderOverallStat();
