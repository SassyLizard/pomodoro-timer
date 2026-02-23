// Pomodoro Timer
const app = document.getElementById('app');
const modeEl = document.getElementById('timer-mode');
const displayEl = document.getElementById('timer-display');
const startPauseBtn = document.getElementById('timer-start-pause');
const resetBtn = document.getElementById('timer-reset');
const previewModeBtn = document.getElementById('timer-preview-mode');
const settingsWorkInput = document.getElementById('settings-work-minutes');
const settingsBreakInput = document.getElementById('settings-break-minutes');
const settingsApplyBtn = document.getElementById('settings-apply');

let workDuration = 25 * 60;   // seconds
let breakDuration = 5 * 60;   // seconds
let timeRemaining = 25 * 60;
let isRunning = false;
let currentMode = 'work';
let tickInterval = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const beepDuration = 0.12;
    const gap = 0.08;
    for (let i = 0; i < 3; i++) {
      const t = audioContext.currentTime + i * (beepDuration + gap);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + beepDuration);
      oscillator.start(t);
      oscillator.stop(t + beepDuration);
    }
  } catch (_) {}
}

function switchMode() {
  currentMode = currentMode === 'work' ? 'break' : 'work';
  timeRemaining = currentMode === 'work' ? workDuration : breakDuration;
  app.dataset.mode = currentMode;
  document.body.dataset.mode = currentMode;
  modeEl.textContent = currentMode === 'work' ? 'Work' : 'Break';
  modeEl.setAttribute('aria-label', `Current mode: ${currentMode === 'work' ? 'Work' : 'Break'}`);
  displayEl.textContent = formatTime(timeRemaining);
  displayEl.setAttribute('aria-label', `Time remaining: ${formatTime(timeRemaining)}`);
  previewModeBtn.setAttribute('aria-checked', currentMode === 'break');
  if (previewModeLabel) previewModeLabel.textContent = currentMode === 'work' ? 'Break mode' : 'Work mode';
  document.body.classList.add('timer-flash');
  setTimeout(() => document.body.classList.remove('timer-flash'), 550);
}

function tick() {
  if (timeRemaining <= 0) {
    playNotificationSound();
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
  timeRemaining = currentMode === 'work' ? workDuration : breakDuration;
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
  previewModeBtn.setAttribute('aria-checked', currentMode === 'break');
  if (previewModeLabel) previewModeLabel.textContent = currentMode === 'work' ? 'Break mode' : 'Work mode';
}

function applySettings() {
  const workMin = Math.min(60, Math.max(1, Number(settingsWorkInput.value) || 25));
  const breakMin = Math.min(60, Math.max(1, Number(settingsBreakInput.value) || 5));
  workDuration = workMin * 60;
  breakDuration = breakMin * 60;
  settingsWorkInput.value = workMin;
  settingsBreakInput.value = breakMin;
  if (!isRunning) {
    timeRemaining = currentMode === 'work' ? workDuration : breakDuration;
    updateDisplay();
  }
}

/** Temporary: manually switch work/break mode to preview the UI. Remove when no longer needed. */
function toggleModeForPreview() {
  switchMode();
}

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', reset);
const previewModeLabel = document.querySelector('.timer__preview-mode-label');
previewModeBtn.addEventListener('click', toggleModeForPreview);
if (previewModeLabel) previewModeLabel.addEventListener('click', toggleModeForPreview);
settingsApplyBtn.addEventListener('click', applySettings);

document.querySelectorAll('.settings-panel__step').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.getAttribute('data-for'));
    if (!input) return;
    const min = Number(input.min) || 1;
    const max = Number(input.max) || 60;
    let val = Number(input.value) || min;
    if (btn.classList.contains('settings-panel__step--up')) {
      val = Math.min(max, val + 1);
    } else {
      val = Math.max(min, val - 1);
    }
    input.value = val;
  });
});

settingsWorkInput.value = Math.floor(workDuration / 60);
settingsBreakInput.value = Math.floor(breakDuration / 60);
updateDisplay();

// Expose for console: window.toggleModeForPreview(), or use the "Preview mode" button
window.toggleModeForPreview = toggleModeForPreview;
