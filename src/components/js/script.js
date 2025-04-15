import { getRandomWord } from "./dictionaries.js";

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
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");
const wordDisplay = document.getElementById("word-display");
const testContainer = document.getElementById("test-container");
const results = document.getElementById("results");


// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    currentLetterIndex = 0;
    correctLetters = 0;
    totalLetters = 0;
    totalKeystrokes = 0;
    startTime = null;
    clearInterval(timerInterval);
    timeLeft = parseInt(timerSelect.value);

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
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        
        // Add letters
        word.split("").forEach((letter, letterIndex) => {
            const letterSpan = document.createElement("span");
            letterSpan.textContent = letter;
            letterSpan.className = "letter";
            letterSpan.dataset.wordIndex = wordIndex;
            letterSpan.dataset.letterIndex = letterIndex;
            wordSpan.appendChild(letterSpan);
        });

        // Add space after word
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

    // Highlight first letter
    const firstLetter = wordDisplay.querySelector(".letter");
    if (firstLetter) firstLetter.style.textDecoration = "underline";

    testContainer.value = "";
    updateResults();
};

// Start the timer
const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateResults();
            
            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - startTime) / 1000; // Seconds
    const wpm = ((correctLetters / 5) / (elapsedTime / 60)).toFixed(2); // 5 chars = 1 word
    const accuracy = Math.min(100, totalKeystrokes > 0 ? ((correctLetters / totalKeystrokes) * 100).toFixed(2) : 100);

    return { wpm, accuracy };
};

// Update display of current letter and stats
const updateLetter = (event) => {
    if (!timeLeft) return;

    const key = event.key;
    
    // Handle backspace
    if (key === "Backspace") {
        if (totalLetters > 0) {
            const letters = wordDisplay.querySelectorAll(".letter");
            const prevLetter = letters[totalLetters - 1];
            
            // Remove styling from previous letter
            prevLetter.textContent == "_" ? prevLetter.textContent = " " : prevLetter.textContent = prevLetter.textContent;
            prevLetter.classList.remove("text-amber-500", "text-red-500");
            prevLetter.style.textDecoration = "underline";
            
            // Remove styling from current letter if it exists
            const currentLetter = letters[totalLetters];
            if (currentLetter) {
                currentLetter.style.textDecoration = "none";
            }
            
            // Update counters
            totalLetters--;
            if (prevLetter.classList.contains("text-amber-500")) {
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
        }
        return;
    }

    if (key.length !== 1 && key !== " ") return; // Ignore special keys except space

    startTimer();
    
    const currentWord = wordsToType[currentWordIndex];
    const letters = wordDisplay.querySelectorAll(".letter");
    const currentLetter = letters[totalLetters];
    
    if (!currentLetter) return;

    totalLetters++;
    totalKeystrokes++;
    
    // Check if the typed letter matches the current letter
    const isCorrect = key === currentLetter.textContent;
    if (isCorrect) {
        currentLetter.classList.add("text-amber-500");
        correctLetters++;
    } else {
        currentLetter.textContent == " " ? currentLetter.textContent = "_" : currentLetter.textContent = currentLetter.textContent;
        currentLetter.classList.add("text-red-500");
    }

    // Remove underline from current letter
    currentLetter.style.textDecoration = "none";

    // Update word/letter indices
    currentLetterIndex++;
    if (currentLetterIndex >= currentWord.length + 1) { // +1 for space
        currentWordIndex++;
        currentLetterIndex = 0;
    }

    // Underline next letter if available
    const nextLetter = letters[totalLetters];
    if (nextLetter) {
        nextLetter.style.textDecoration = "underline";
    }

    // Check if we need to scroll the text
    const lineHeight = parseInt(window.getComputedStyle(wordDisplay).getPropertyValue('line-height'));
    const currentLine = Math.floor(currentLetter.offsetTop / lineHeight);
    
    if (currentLine >= 2) {
        const scrollAmount = (currentLine - 1) * lineHeight; // Garde toujours 2 lignes visibles au-dessus
        wordDisplay.style.transform = `translateY(-${scrollAmount}px)`;
    } else {
        wordDisplay.style.transform = 'translateY(0)'; 
    }

    // Update stats
    updateResults();
};

// End the typing test
const endTest = () => {
    clearInterval(timerInterval);
    timeLeft = 0;
    const { wpm, accuracy } = getCurrentStats();
    results.textContent = `Test terminé ! WPM: ${wpm}, Précision: ${accuracy}%`;
    testContainer.value = "";
};

let resultsChart = null;

// Update results display
const updateResults = () => {
    if (!startTime) {
        results.textContent = `Time left: ${timeLeft}s`;
        if (resultsChart) {
            resultsChart.destroy();
            resultsChart = null;
        }
        return;
    }

    const { wpm, accuracy } = getCurrentStats();
    results.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}% | Time left: ${timeLeft}s`;

    // Update or create pie chart
    const correctPercentage = accuracy;
    const incorrectPercentage = 100 - accuracy;

    if (resultsChart) {
        resultsChart.data.datasets[0].data = [correctPercentage, incorrectPercentage];
        resultsChart.update();
    } else {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        resultsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [correctPercentage, incorrectPercentage],
                    backgroundColor: [
                        'rgb(255, 191, 36)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgb(156, 163, 175)' // gray-400
                        }
                    }
                }
            }
        });
    }
};

// Event listeners
testContainer.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        event.preventDefault(); // Prevent scrolling
    }
});

testContainer.addEventListener("keyup", updateLetter);
modeSelect.addEventListener("change", () => startTest());
timerSelect.addEventListener("change", () => startTest());

// Add language change listener
const languageSelect = document.getElementById('language');
languageSelect.addEventListener("change", () => startTest());

// Restart button handler
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
    startTest();
    testContainer.focus();
});

// Start the test
startTest();
