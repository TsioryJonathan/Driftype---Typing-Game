import { hideProgressBar } from "../progressBar.js";
import {
  getCurrentStats,
  getTimerSelect,
  getModeSelect,
  getTestContainer,
  setOnTimeUp,
} from "./engine.js";
import { calcConsistency, getTimelineData } from "./chart.js";
import { statPost } from "./statsApi.js";
import { checkBadges } from "../badges.js";
import { getUser } from "../../../utils/auth.js";

export const launchFireworks = () => {
  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.7 },
      colors: ["#f59e42", "#ef4444", "#fffde4", "#fff", "#fde68a"],
    });
    setTimeout(() => {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#f59e42", "#ef4444", "#fffde4", "#fff", "#fde68a"],
      });
    }, 600);
  }
};

export const renderResults = (stats) => {
  const { wpm, accuracy, raw, correct, incorrect, extra } = stats;
  const consistency = calcConsistency();
  const timerSelect = getTimerSelect();
  const modeSelect = getModeSelect();
  const timerValue = parseInt(timerSelect.value);

  const langSelect = document.getElementById("language");
  const langValue = langSelect ? langSelect.value : "en";
  const modeValue =
    modeSelect.value || modeSelect.textContent?.toLowerCase() || "medium";

  let langLabel = langValue;
  if (langValue === "en") langLabel = "English";
  else if (langValue === "fr") langLabel = "French";
  else if (langValue === "es") langLabel = "Spanish";
  else if (langValue === "de") langLabel = "German";
  else if (langValue === "it") langLabel = "Italian";
  else if (langValue === "pt") langLabel = "Portuguese";
  else if (langValue === "numbers") langLabel = "Numbers";
  else langLabel = langValue.charAt(0).toUpperCase() + langValue.slice(1);

  let modeLabel = modeValue.charAt(0).toUpperCase() + modeValue.slice(1);
  if (modeValue === "numbers") modeLabel = "Numbers";

  const modeIcon =
    modeValue === "numbers"
      ? '<i class="fa-solid fa-hashtag text-[var(--color-warning)]"></i>'
      : "";

  const results = document.getElementById("results-container");
  results.innerHTML = `
    <div class=" min-h-[300px] flex flex-col md:flex-row gap-4 p-6 rounded-2xl shadow-2xl border-2 border-amber-500/60 mx-auto max-w-7xl relative">
      <!-- Left block: WPM, ACC, Info -->
      <div class="flex flex-col gap-4 min-w-[280px] justify-between items-start">
        <div>
          <div class="text-[1.3rem] text-[var(--color-warning)] font-mono mb-2 uppercase tracking-widest">wpm <i class="fa-solid fa-crown text-[var(--color-warning)]"></i></div>
          <div class="text-8xl font-black text-[var(--color-warning)] drop-shadow-xl">${wpm}</div>
        </div>
        <div>
          <div class="text-[1.3rem] text-[var(--color-accent)] font-mono mb-2 uppercase tracking-widest">acc</div>
          <div class="text-7xl font-black text-[var(--color-accent)] drop-shadow-xl leading-tight">${accuracy}%</div>
        </div>
        <div class="mt-6 p-6 bg-[var(--color-color-bg-secondary)] text-[var(--color-text-secondary)] text-sm font-mono lowercase flex flex-col gap-2">
          <div>language: <span class="text-[var(--color-secondary)] font-bold">${langLabel}</span></div>
          <div>mode: <span class="text-[var(--color-secondary)] font-bold">${modeLabel} ${modeIcon}</span></div>
          <div>time: <span class="text-[var(--color-secondary)] font-bold">${timerValue}s</span></div>
        </div>
      </div>
      <!-- Center: Timeline Chart -->
      <div class="flex-1 flex flex-col justify-center items-center">
        <div class="w-full h-[350px] relative">
          <canvas id="timelineChart" height="380" width="800"></canvas>
        </div>
        <div class="flex flex-row justify-between w-full mt-8 text-gray-300 text-center font-mono text-xl gap-4">
          <div class="flex-1">
            <div class="text-base text-[var(--color-text-secondary)]">raw</div>
            <div id="rawWpm" class="text-[var(--color-secondary)]">${raw ?? "-"}</div>
          </div>
          <div class="flex-1">
            <div class="text-base text-[var(--color-text-secondary)]">Characters</div>
            <div id="breakdown" class="text-[var(--color-secondary)]">${[correct, incorrect, extra].map((x) => x ?? "-").join("/")}</div>
          </div>
          <div class="flex-1">
            <div class="text-base text-[var(--color-text-secondary)]">consistency</div>
            <div id="consistency" class="text-[var(--color-secondary)]">${consistency ?? "-"}</div>
          </div>
        </div>
      </div>
      <!-- Fireworks canvas overlay -->
      <canvas id="fireworks" class="pointer-events-none absolute inset-0 w-full h-full"></canvas>
    </div>
  `;
};

export const endTest = async () => {
  hideProgressBar();
  const testContainer = getTestContainer();
  const results = document.getElementById("results-container");
  testContainer.classList.add("hidden");
  results.classList.remove("hidden");

  const stats = getCurrentStats();
  testContainer.value = "";

  renderResults(stats);
  launchFireworks();

  const user = getUser();

  if (!user) {
    document
      .getElementById("not-logged-popup")
      .classList.replace("hidden", "flex");
    return;
  }

  const { id } = user;

  document.getElementById("stat-popup").classList.replace("hidden", "flex");

  setTimeout(() => {
    document.getElementById("stat-popup").classList.replace("flex", "hidden");
  }, 3000);

  const language = document.getElementById("language").value;
  const modeSelect = getModeSelect();
  const timerSelect = getTimerSelect();

  statPost(
    id,
    stats.wpm,
    stats.accuracy,
    language,
    modeSelect.value,
    timerSelect.value
  );

  checkBadges(id, stats);

  setTimeout(() => {
    document.getElementById("stat-popup").classList.add("hidden");
  }, 3000);
};

export const setupEndTestCallback = () => {
  setOnTimeUp(endTest);
};
