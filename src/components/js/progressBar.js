export const updateProgressBar = (timeLeft, timerSelect) => {
  const progressBar = document.getElementById("progress-bar");
  const countdownTimer = document.getElementById("countdown-timer");
  if (!progressBar || !countdownTimer) return;
  const total = parseInt(timerSelect.value);
  const percent = Math.max(0, (timeLeft / total) * 100);
  progressBar.style.width = `${percent}%`;
  countdownTimer.textContent = `${timeLeft}s`;
};

export const showProgressBar = () => {
  const container = document.getElementById("progress-bar-container");
  if (container) container.classList.remove("hidden");
};

export const hideProgressBar = () => {
  const container = document.getElementById("progress-bar-container");
  if (container) container.classList.add("hidden");
};
