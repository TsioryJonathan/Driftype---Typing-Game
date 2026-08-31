import { tinykeys } from "./tinykeys.js";
import {
  startTest,
  updateLetter,
  initEngine,
  getTestContainer,
} from "./game/engine.js";
import { setupEndTestCallback } from "./game/results.js";

// Typewriter click sound: try loading sample, fallback to generated click
let keyAudio;
try {
  keyAudio = new Audio('/src/assets/typewriter-key.mp3');
  keyAudio.volume = 0.3;
} catch (e) {
  keyAudio = null;
}
function fallbackKeySound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = ctx.createBuffer(1, 44100 * 0.01, 44100);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / data.length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.connect(ctx.destination);
  noise.start();
}
function playKeySound() {
  if (keyAudio && keyAudio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    keyAudio.currentTime = 0;
    keyAudio.play().catch(fallbackKeySound);
  } else {
    fallbackKeySound();
  }
}

initEngine();
setupEndTestCallback();

const testContainer = getTestContainer();
const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");

const languageSelect = document.getElementById("language");
languageSelect.addEventListener("change", () => startTest());
tinykeys(window, {
  "Control+Enter": () => {
    startTest();
    testContainer.focus();
  },
});
testContainer.addEventListener('keyup', updateLetter);
modeSelect.addEventListener('change', () => startTest());
timerSelect.addEventListener('change', () => startTest());
testContainer.addEventListener('keydown', (event) => {
  const { keyboardSounds = false } = JSON.parse(localStorage.getItem('soundFeedbackSettings')) || {};
  if (keyboardSounds && (event.key.length === 1 || event.key === ' ')) {
    playKeySound();
  }
  if (event.key === ' ') {
    event.preventDefault();
  }
});
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
  startTest();
  testContainer.focus();
});

startTest();
