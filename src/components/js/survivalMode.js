// survivalMode.js
export class SurvivalMode {
    constructor() {
      this.currentStreak = 0;
      this.totalTypedChars = 0;
      this.startTime = null;
      this.timerInterval = null;
      this.isRunning = false;
    }
  
    initElements() {
      this.wordDisplay = document.getElementById('word-display');
      this.userInput = document.getElementById('typing-input');
      this.timeDisplay = document.getElementById('time-elapsed');
      this.streakDisplay = document.getElementById('word-streak');
      this.wpmDisplay = document.getElementById('live-wpm');
    }
  
    start() {
      this.initElements();
      this.reset();
      this.isRunning = true;
      
      this.userInput.addEventListener('input', this.handleInput.bind(this));
      document.getElementById('restart-btn')?.addEventListener('click', () => this.start());
      
      this.displayRandomWord();
      this.userInput.focus();
    }
  
    reset() {
      this.currentStreak = 0;
      this.totalTypedChars = 0;
      this.isRunning = false;
      
      if (this.timerInterval) clearInterval(this.timerInterval);
      
      this.streakDisplay.textContent = "0";
      this.wpmDisplay.textContent = "0";
      this.timeDisplay.textContent = "0s";
      this.userInput.value = "";
    }
  
    displayRandomWord() {
      const word = getRandomWord('survival');
      this.wordDisplay.textContent = word;
      this.startTimer();
    }
  
    startTimer() {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => this.updateStats(), 1000);
    }
  
    updateStats() {
      const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      const wpm = Math.round((this.totalTypedChars / 5) / (elapsedSeconds / 60));
      
      this.timeDisplay.textContent = `${elapsedSeconds}s`;
      this.wpmDisplay.textContent = isFinite(wpm) ? wpm : 0;
    }
  
    handleInput(e) {
      if (!this.isRunning) return;
      
      this.totalTypedChars = e.target.value.length;
      
      if (!this.wordDisplay.textContent.startsWith(e.target.value)) {
        this.endGame();
        return;
      }
      
      if (e.target.value === this.wordDisplay.textContent) {
        this.currentStreak++;
        this.streakDisplay.textContent = this.currentStreak;
        e.target.value = "";
        this.displayRandomWord();
      }
    }
  
    endGame() {
      this.isRunning = false;
      clearInterval(this.timerInterval);
      
      const finalStats = {
        streak: this.currentStreak,
        wpm: Math.round((this.totalTypedChars / 5) / ((Date.now() - this.startTime) / 60000)),
        time: Math.floor((Date.now() - this.startTime) / 1000)
      };
      
      // Utilisez votre système d'affichage existant
      showResults(finalStats); 
    }
  }