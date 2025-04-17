import { getRandomWord } from './dictionaries.js';
import { tinykeys } from './tinykeys.js';
import {
  updateProgressBar,
  showProgressBar,
  hideProgressBar,
} from './progressBar.js';
import { API_URL } from './pages/login.js';

/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 *
 * Sur ce... Amusez-vous bien !
 */
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

const modeSelect = document.getElementById('mode');
const timerSelect = document.getElementById('timer');
const wordDisplay = document.getElementById('word-display');
const testContainer = document.getElementById('test-container');
const results = document.getElementById('results-container');

// Initialize the typing test
const startTest = (wordCount = 200) => {
  testContainer.classList.remove('hidden');
  results.classList.add('hidden');
  wordsToType.length = 0;
  wordDisplay.innerHTML = '';
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
  wordDisplay.style.transform = 'translateY(0)';

  // Reset chart
  if (resultsChart) {
    resultsChart.destroy();
    resultsChart = null;
  }

  // Generate words
  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  // Create spans for each letter of each word
  wordsToType.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    // Add letters
    word.split('').forEach((letter, letterIndex) => {
      const letterSpan = document.createElement('span');
      letterSpan.textContent = letter;
      letterSpan.className = 'letter';
      letterSpan.dataset.wordIndex = wordIndex;
      letterSpan.dataset.letterIndex = letterIndex;
      wordSpan.appendChild(letterSpan);
    });

    // Add space after word
    if (wordIndex < wordsToType.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = ' ';
      spaceSpan.className = 'letter';
      spaceSpan.dataset.wordIndex = wordIndex;
      spaceSpan.dataset.letterIndex = word.length;
      wordSpan.appendChild(spaceSpan);
    }

    wordDisplay.appendChild(wordSpan);
  });

  // Highlight first letter
  const firstLetter = wordDisplay.querySelector('.letter');
  if (firstLetter) firstLetter.style.textDecoration = 'underline';

  testContainer.value = '';
  updateResults();
  updateProgressBar(timeLeft, timerSelect);
  showProgressBar();
  startTimelineTracking();
};

// Start the timer
const startTimer = () => {
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateResults();
      }

      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  }
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
  // Calculate WPM, accuracy, raw, correct, incorrect, extra, consistency
  const elapsed = Math.max((Date.now() - startTime) / 1000, 1);
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
  const consistency = calcConsistency ? calcConsistency() : '-';
  return { wpm, accuracy, raw, correct, incorrect, extra, consistency };
};

// Update display of current letter and stats
const updateLetter = (event) => {
  if (!timeLeft) return;

  const key = event.key;

  // Handle backspace
  if (key === 'Backspace') {
    if (totalLetters > 0) {
      const letters = wordDisplay.querySelectorAll('.letter');
      const prevLetter = letters[totalLetters - 1];

      // Remove styling from previous letter
      prevLetter.textContent == '_'
        ? (prevLetter.textContent = ' ')
        : (prevLetter.textContent = prevLetter.textContent);
      prevLetter.classList.remove('text-amber-500', 'text-red-500');
      prevLetter.style.textDecoration = 'underline';

      // Remove styling from current letter if it exists
      const currentLetter = letters[totalLetters];
      if (currentLetter) {
        currentLetter.style.textDecoration = 'none';
      }

      // Update counters
      totalLetters--;
      if (prevLetter.classList.contains('text-amber-500')) {
        correctLetters--;
      }

      // Update word/letter indices
      if (currentLetterIndex > 0) {
        currentLetterIndex--;
      } else if (currentWordIndex > 0) {
        currentWordIndex--;
        const prevWord = wordsToType[currentWordIndex];
        currentLetterIndex = prevWord.length;
      }

      updateResults();
      updateProgressBar(timeLeft, timerSelect);
    }
    return;
  }

  if (key.length !== 1 && key !== ' ') return; // Ignore special keys except space

  startTimer();

  const currentWord = wordsToType[currentWordIndex];
  const letters = wordDisplay.querySelectorAll('.letter');
  const currentLetter = letters[totalLetters];

  if (!currentLetter) return;

  totalLetters++;
  totalKeystrokes++;

  // Check if the typed letter matches the current letter
  const isCorrect = key === currentLetter.textContent;
  if (isCorrect) {
    currentLetter.classList.add('text-amber-500');
    correctLetters++;
  } else {
    currentLetter.textContent == ' '
      ? (currentLetter.textContent = '_')
      : (currentLetter.textContent = currentLetter.textContent);
    currentLetter.classList.add('text-red-500');
    incorrectLetters++;
  }

  // Remove underline from current letter
  currentLetter.style.textDecoration = 'none';

  // Update word/letter indices
  currentLetterIndex++;
  if (currentLetterIndex >= currentWord.length + 1) {
    // +1 for space
    currentWordIndex++;
    currentLetterIndex = 0;
  }

  // Underline next letter if available
  const nextLetter = letters[totalLetters];
  if (nextLetter) {
    nextLetter.style.textDecoration = 'underline';
  }

  // Check if we need to scroll the text
  const lineHeight = parseInt(
    window.getComputedStyle(wordDisplay).getPropertyValue('line-height'),
  );
  const currentLine = Math.floor(currentLetter.offsetTop / lineHeight);

  if (currentLine >= 2) {
    const scrollAmount = (currentLine - 1) * lineHeight; // Garde toujours 2 lignes visibles au-dessus
    wordDisplay.style.transform = `translateY(-${scrollAmount}px)`;
  } else {
    wordDisplay.style.transform = 'translateY(0)';
  }

  // Update stats
  updateResults();
  updateProgressBar(timeLeft, timerSelect);
};

// End the typing test
const endTest = async () => {
  hideProgressBar();
  testContainer.classList.add('hidden');
  results.classList.remove('hidden');
  clearInterval(timerInterval);
  stopTimelineTracking();
  timeLeft = 0;
  const { wpm, accuracy, raw, correct, incorrect, extra, consistency } =
    getCurrentStats();
  const langSelect = document.getElementById('language');
  const modeSelect = document.getElementById('mode') ||
    document.getElementById('mode-button') || { value: 'medium' };
  const timerValue = parseInt(timerSelect.value);
  const langValue = langSelect ? langSelect.value : 'en';
  const modeValue =
    modeSelect.value || modeSelect.textContent?.toLowerCase() || 'medium';
  let langLabel = langValue;
  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));
  if (langValue === 'en') langLabel = 'English';
  else if (langValue === 'fr') langLabel = 'French';
  else if (langValue === 'es') langLabel = 'Spanish';
  else if (langValue === 'de') langLabel = 'German';
  else if (langValue === 'it') langLabel = 'Italian';
  else if (langValue === 'pt') langLabel = 'Portuguese';
  else if (langValue === 'numbers') langLabel = 'Numbers';
  else langLabel = langValue.charAt(0).toUpperCase() + langValue.slice(1);
  let modeLabel = modeValue.charAt(0).toUpperCase() + modeValue.slice(1);
  if (modeValue === 'numbers') modeLabel = 'Numbers';
  // Special icon for numbers mode
  const modeIcon =
    modeValue === 'numbers'
      ? '<i class="fa-solid fa-hashtag text-[var(--color-warning)]"></i>'
      : '';
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
            <div class="text-base text-[var(--color-text)]">raw</div>
            <div id="rawWpm">${raw ?? '-'}</div>
          </div>
          <div class="flex-1">
            <div class="text-base text-[var(--color-text)]">correct/incorrect/extra</div>
            <div id="breakdown">${[correct, incorrect, extra].map((x) => x ?? '-').join('/')}</div>
          </div>
          <div class="flex-1">
            <div class="text-base text-[var(--color-text)]">consistency</div>
            <div id="consistency">${consistency ?? '-'}</div>
          </div>
        </div>
      </div>
      <!-- Fireworks canvas overlay -->
      <canvas id="fireworks" class="pointer-events-none absolute inset-0 w-full h-full"></canvas>
    </div>
  `;
  testContainer.value = '';
  updateResults();
  launchFireworks();
  console.log(id);

  if (!id) return;
  statPost(id, wpm, accuracy, langValue, modeValue, timerValue);
};

// Stat Posting Function

const statPost = async (
  userId,
  wpm,
  accuracy,
  language,
  difficulty,
  time_taken,
) => {
  try {
    const response = await fetch(`${API_URL}/stats/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.error('Erreur when sending data :', data.message);
      return null;
    }

    console.log('Stat sent successfully:', data);

    Toastify({
      text: 'Stats sent succesfully 🎉',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
    }).showToast();

    return data;
  } catch (error) {
    console.error('Network Error :', error);
    return null;
  }
};

// Fireworks/confetti animation using canvas-confetti CDN
function launchFireworks() {
  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#f59e42', '#ef4444', '#fffde4', '#fff', '#fde68a'],
    });
    setTimeout(() => {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#f59e42', '#ef4444', '#fffde4', '#fff', '#fde68a'],
      });
    }, 600);
  }
}

// Timeline chart: dark theme, yellow (amber-500) for WPM, red-500 for errors
const updateResults = () => {
  if (!startTime) {
    results.textContent = `Time left: ${timeLeft}s`;
    if (timelineChart) {
      timelineChart.destroy();
      timelineChart = null;
    }
    return;
  }
  updateProgressBar(timeLeft, timerSelect);
  const { wpm, accuracy } = getCurrentStats();
  const timelineCtx = document
    .getElementById('timelineChart')
    ?.getContext('2d');
  if (timelineCtx) {
    if (timelineChart) timelineChart.destroy();
    timelineChart = new Chart(timelineCtx, {
      type: 'line',
      data: {
        labels: timelineLabels.map((_, i) => (i + 1).toString()), // X axis: seconds (1, 2, ...)
        datasets: [
          {
            label: 'WPM',
            data: timelineWpm,
            borderColor: '#facc15', // amber-400
            backgroundColor: 'transparent',
            borderWidth: 3,
            fill: false,
            tension: 0.25,
            pointRadius: 2,
            pointBackgroundColor: '#facc15',
            pointBorderColor: '#facc15',
            yAxisID: 'y',
            order: 1,
          },
          {
            label: 'Errors',
            data: timelineErrors,
            borderColor: '#a3a3a3', // gray-400
            backgroundColor: 'transparent',
            borderWidth: 2,
            fill: false,
            tension: 0.25,
            pointRadius: 3,
            pointBackgroundColor: timelineErrors.map((e) =>
              e > 0 ? '#ef4444' : '#a3a3a3',
            ),
            pointBorderColor: timelineErrors.map((e) =>
              e > 0 ? '#ef4444' : '#a3a3a3',
            ),
            yAxisID: 'y1',
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              color: '#e5e5e5',
              font: { size: 15, weight: 'bold' },
              usePointStyle: true,
              padding: 12,
              boxWidth: 18,
              boxHeight: 8,
              boxPadding: 2,
            },
          },
          title: { display: false },
          tooltip: {
            backgroundColor: '#23232a',
            titleColor: '#fde68a',
            bodyColor: '#fff',
            borderColor: '#fde68a',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Seconds',
              color: '#bcbcbc',
              font: { size: 16, weight: 'bold' },
            },
            ticks: {
              color: '#bcbcbc',
              font: { size: 13 },
              callback: function (val, idx) {
                const total = this.getLabels().length;
                if (total > 30) {
                  return idx % 2 === 0 ? this.getLabelForValue(val) : '';
                }
                return this.getLabelForValue(val);
              },
            },
            grid: {
              color: 'rgba(255,255,255,0.08)',
              drawOnChartArea: true,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Words per Minute',
              color: '#facc15',
              font: { size: 16, weight: 'bold' },
            },
            beginAtZero: true,
            ticks: {
              color: '#facc15',
              font: { size: 14 },
              stepSize: 20,
              callback: function (val) {
                return val % 20 === 0 ? val : '';
              },
            },
            grid: {
              color: 'rgba(255,255,255,0.08)',
              drawOnChartArea: true,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Errors',
              color: '#ef4444',
              font: { size: 16, weight: 'bold' },
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(255,255,255,0.08)',
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
            ticks: { color: '#ef4444', font: { size: 14 } },
          },
        },
      },
    });
  }
};

// --- Calculate typing consistency (standard deviation of WPM, expressed as % of mean WPM, subtracted from 100) ---
const calcConsistency = () => {
  if (!timelineWpm || timelineWpm.length < 2) return '-';
  const mean = timelineWpm.reduce((a, b) => a + b, 0) / timelineWpm.length;
  const variance =
    timelineWpm.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) /
    timelineWpm.length;
  const stddev = Math.sqrt(variance);
  const percent = mean > 0 ? Math.max(0, 100 - (stddev / mean) * 100) : 0;
  return Math.round(percent) + '%';
};

// --- Chart.js chart instances ---
let resultsChart = null;
let wpmChart = null;
let timelineChart = null;

// --- Arrays to track stats over time during the test ---
let timelineWpm = [];
let timelineErrors = [];
let timelineLabels = [];
let timelineInterval = null;

// --- Start tracking stats over time when the test starts ---
function startTimelineTracking() {
  timelineWpm = [];
  timelineErrors = [];
  timelineLabels = [];
  if (timelineInterval) clearInterval(timelineInterval);
  let seconds = 0;
  timelineInterval = setInterval(() => {
    const { wpm } = getCurrentStats();
    timelineWpm.push(Number(wpm));
    timelineErrors.push(totalKeystrokes - correctLetters);
    timelineLabels.push(seconds + 's');
    seconds++;
  }, 1000);
}

// --- Stop tracking ---
function stopTimelineTracking() {
  if (timelineInterval) clearInterval(timelineInterval);
  timelineInterval = null;
}

// Add language change listener
const languageSelect = document.getElementById('language');
languageSelect.addEventListener('change', () => startTest());

tinykeys(window, {
  'Control+Enter': () => {
    startTest();
    testContainer.focus();
  },
});
testContainer.addEventListener('keyup', updateLetter);
modeSelect.addEventListener('change', () => startTest());
timerSelect.addEventListener('change', () => startTest());
testContainer.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    event.preventDefault(); // Prevent scrolling
  }
});

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
  startTest();
  testContainer.focus();
});

// Start the test
startTest();
