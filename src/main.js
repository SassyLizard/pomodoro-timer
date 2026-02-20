// Pomodoro Timer
const WORK_DURATION = 25 * 60;   // 25 minutes in seconds
const BREAK_DURATION = 5 * 60;   // 5 minutes in seconds

const app = document.getElementById('app');
const modeEl = document.getElementById('timer-mode');
const displayEl = document.getElementById('timer-display');
const startPauseBtn = document.getElementById('timer-start-pause');
const resetBtn = document.getElementById('timer-reset');

let timeRemaining = WORK_DURATION;
let isRunning = false;
let currentMode = 'work';
let tickInterval = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function switchMode() {
  currentMode = currentMode === 'work' ? 'break' : 'work';
  timeRemaining = currentMode === 'work' ? WORK_DURATION : BREAK_DURATION;
  app.dataset.mode = currentMode;
  document.body.dataset.mode = currentMode;
  modeEl.textContent = currentMode === 'work' ? 'Work' : 'Break';
  modeEl.setAttribute('aria-label', `Current mode: ${currentMode === 'work' ? 'Work' : 'Break'}`);
  displayEl.textContent = formatTime(timeRemaining);
  displayEl.setAttribute('aria-label', `Time remaining: ${formatTime(timeRemaining)}`);
}

function tick() {
  if (timeRemaining <= 0) {
    switchMode();
    return;
  }
  timeRemaining -= 1;
  displayEl.textContent = formatTime(timeRemaining);
  displayEl.setAttribute('aria-label', `Time remaining: ${formatTime(timeRemaining)}`);
}

function startPause() {
  isRunning = !isRunning;
  if (isRunning) {
    startPauseBtn.textContent = 'Pause';
    startPauseBtn.setAttribute('aria-label', 'Pause timer');
    tickInterval = setInterval(tick, 1000);
  } else {
    startPauseBtn.textContent = 'Start';
    startPauseBtn.setAttribute('aria-label', 'Start timer');
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

function reset() {
  isRunning = false;
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  timeRemaining = currentMode === 'work' ? WORK_DURATION : BREAK_DURATION;
  startPauseBtn.textContent = 'Start';
  startPauseBtn.setAttribute('aria-label', 'Start timer');
  updateDisplay();
}

function updateDisplay() {
  displayEl.textContent = formatTime(timeRemaining);
  displayEl.setAttribute('aria-label', `Time remaining: ${formatTime(timeRemaining)}`);
  modeEl.textContent = currentMode === 'work' ? 'Work' : 'Break';
  modeEl.setAttribute('aria-label', `Current mode: ${currentMode === 'work' ? 'Work' : 'Break'}`);
  app.dataset.mode = currentMode;
  document.body.dataset.mode = currentMode;
}

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', reset);

updateDisplay();
