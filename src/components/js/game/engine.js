import { getRandomWord } from "../dictionaries.js";
import {
  updateProgressBar,
  showProgressBar,
} from "../progressBar.js";
import { updateResults, startTimelineTracking, stopTimelineTracking, resetChart, initChart } from "./chart.js";

let startTime = null;
let timeLeft = 0;
let timerInterval = null;
let currentWordIndex = 0;
let currentLetterIndex = 0;
let correctLetters = 0;
let totalLetters = 0;
let totalKeystrokes = 0;
let incorrectLetters = 0;
let extraLetters = 0;
const wordsToType = [];

let onTimeUp = null;

const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");
const wordDisplay = document.getElementById("word-display");
const testContainer = document.getElementById("test-container");
const results = document.getElementById("results-container");

export const getStartTime = () => startTime;
export const getTimeLeft = () => timeLeft;
export const getTotalKeystrokes = () => totalKeystrokes;
export const getCorrectLetters = () => correctLetters;
export const getTimerSelect = () => timerSelect;
export const getTestContainer = () => testContainer;
export const getWordsToType = () => wordsToType;
export const getModeSelect = () => modeSelect;
export const setOnTimeUp = (cb) => { onTimeUp = cb; };

export const initEngine = () => {
  initChart({ getCurrentStats, getTotalKeystrokes, getCorrectLetters });
};

export const startTest = (wordCount = 200) => {
  testContainer.classList.remove("hidden");
  results.classList.add("hidden");
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  currentLetterIndex = 0;
  correctLetters = 0;
  totalLetters = 0;
  totalKeystrokes = 0;
  incorrectLetters = 0;
  extraLetters = 0;
  startTime = null;
  clearInterval(timerInterval);
  timeLeft = parseInt(timerSelect.value);
  wordDisplay.style.transform = "translateY(0)";

  resetChart();

  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  wordsToType.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    word.split("").forEach((letter, letterIndex) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = letter;
      letterSpan.className = "letter";
      letterSpan.dataset.wordIndex = wordIndex;
      letterSpan.dataset.letterIndex = letterIndex;
      wordSpan.appendChild(letterSpan);
    });

    if (wordIndex < wordsToType.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.textContent = " ";
      spaceSpan.className = "letter";
      spaceSpan.dataset.wordIndex = wordIndex;
      spaceSpan.dataset.letterIndex = word.length;
      wordSpan.appendChild(spaceSpan);
    }

    wordDisplay.appendChild(wordSpan);
  });

  const firstLetter = wordDisplay.querySelector(".letter");
  if (firstLetter) firstLetter.style.textDecoration = "underline";

  testContainer.value = "";
  updateResults(getCurrentStats());
  updateProgressBar(timeLeft, timerSelect);
  showProgressBar();
  startTimelineTracking();
};

const startTimer = () => {
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateResults(getCurrentStats());
      }

      if (timeLeft <= 0) {
        if (onTimeUp) onTimeUp();
      }
    }, 1000);
  }
};

export const getCurrentStats = () => {
  const elapsed = startTime ? Math.max((Date.now() - startTime) / 1000, 1) : 0;
  const wordsTyped = correctLetters / 5;
  const wpm = Math.round((wordsTyped / elapsed) * 60);
  const raw = Math.round((totalKeystrokes / 5 / elapsed) * 60);
  const accuracy =
    totalKeystrokes > 0
      ? Math.round((correctLetters / totalKeystrokes) * 10000) / 100
      : 0;
  const correct = correctLetters;
  const incorrect = incorrectLetters;
  const extra = extraLetters;
  return { wpm, accuracy, raw, correct, incorrect, extra };
};

export const updateLetter = (event) => {
  if (!timeLeft) return;

  const key = event.key;

  if (key === "Backspace") {
    if (totalLetters > 0) {
      const letters = wordDisplay.querySelectorAll(".letter");
      const prevLetter = letters[totalLetters - 1];

      prevLetter.textContent == "_"
        ? (prevLetter.textContent = " ")
        : (prevLetter.textContent = prevLetter.textContent);
      prevLetter.classList.remove("text-amber-500", "text-red-500");
      prevLetter.style.textDecoration = "underline";

      const currentLetter = letters[totalLetters];
      if (currentLetter) {
        currentLetter.style.textDecoration = "none";
      }

      totalLetters--;
      if (prevLetter.classList.contains("text-amber-500")) {
        correctLetters--;
      }

      if (currentLetterIndex > 0) {
        currentLetterIndex--;
      } else if (currentWordIndex > 0) {
        currentWordIndex--;
        const prevWord = wordsToType[currentWordIndex];
        currentLetterIndex = prevWord.length;
      }

      updateResults(getCurrentStats());
      updateProgressBar(timeLeft, timerSelect);
    }
    return;
  }

  if (key.length !== 1 && key !== " ") return;
  startTimer();

  const currentWord = wordsToType[currentWordIndex];
  const letters = wordDisplay.querySelectorAll(".letter");
  const currentLetter = letters[totalLetters];

  if (!currentLetter) return;

  totalLetters++;
  totalKeystrokes++;

  const isCorrect = key === currentLetter.textContent;
  if (isCorrect) {
    currentLetter.classList.add("text-amber-500");
    correctLetters++;
  } else {
    currentLetter.textContent == " "
      ? (currentLetter.textContent = "_")
      : (currentLetter.textContent = currentLetter.textContent);
    currentLetter.classList.add("text-red-500");
    incorrectLetters++;
  }

  currentLetter.style.textDecoration = "none";

  currentLetterIndex++;
  if (currentLetterIndex >= currentWord.length + 1) {
    currentWordIndex++;
    currentLetterIndex = 0;
  }

  const nextLetter = letters[totalLetters];
  if (nextLetter) {
    nextLetter.style.textDecoration = "underline";
  }

  const lineHeight = parseInt(
    window.getComputedStyle(wordDisplay).getPropertyValue("line-height")
  );
  const currentLine = Math.floor(currentLetter.offsetTop / lineHeight);

  if (currentLine >= 2) {
    const scrollAmount = (currentLine - 1) * lineHeight;
    wordDisplay.style.transform = `translateY(-${scrollAmount}px)`;
  } else {
    wordDisplay.style.transform = "translateY(0)";
  }

  updateResults(getCurrentStats());
  updateProgressBar(timeLeft, timerSelect);
};

export const pauseTest = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};
