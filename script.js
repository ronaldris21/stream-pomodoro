const urlParams = new URLSearchParams(window.location.search);

const lengths = {
  pomodoro: (Number(urlParams.get("pomodoro")) || 0.2) * 60,
  shortBreak: (Number(urlParams.get("shortBreak")) || 0.1) * 60,
  longBreak: (Number(urlParams.get("longBreak")) || 0.2) * 60,
};

const breakSound = new Audio("sounds/break.mp3");
const workSound = new Audio("sounds/work.mp3");

let counterPomodoros = 0;
let cantPomodorosLongBreak = 4;
let mode;
let interval;
let length;
let paused;
let remainingTime;
let endTime;

document.getElementById("sessions").textContent = "Sessions: "+ counterPomodoros;


function setMode(newMode) {
  mode = newMode;
  length = lengths[mode];
  document
    .querySelector("#mode-buttons")
    .querySelectorAll("button")
    .forEach((button) => {
      button.classList.remove("active");
    });
  document.querySelector(`[data-mode=${mode}]`).classList.add("active");
  startTimer();
}

document
  .querySelector("#mode-buttons")
  .addEventListener("click", function (event) {
    const { mode: newMode } = event.target.dataset;
    if (!newMode) return;

    setMode(newMode);
  });

document
  .querySelector("#pause-button")
  .addEventListener("click", function (event) {
    if (paused) {
      endTime = Date.now() + remainingTime * 1000;
      runTimer();
    } else if (interval) {
      clearInterval(interval);
      interval = null;
      paused = true;
      document.querySelector("#pause-button").classList.add("active");
      document.title = "PAUSED";
      document.getElementById("text").textContent = "PAUSED";
    }
  });

document
  .querySelector("#adjust-buttons")
  .addEventListener("click", function (event) {
    if (paused) {
      return;
    }

    const { action } = event.target.dataset;

    switch (action) {
      case "plus":
        if (interval) {
          length += 60;
          endTime += 60000;
          updateClock();
        } else {
          length = 60;
          startTimer();
        }
        break;
      case "minus":
        if (interval) {
          length -= 60;
          endTime -= 60000;
          if (endTime < 0) {
            endTime = 0;
          }
          updateClock();
        }
        break;
    }
  });

function updateClock() {
  remainingTime = (endTime - Date.now()) / 1000;
  if (remainingTime <= 0) {
    remainingTime = 0;
    clearInterval(interval);
    interval = null;
    if (mode === "pomodoro") {
      breakSound.play();
      breakSound.play();
      breakSound.play();
      counterPomodoros++;
      document.getElementById("sessions").textContent = "Sessions: "+ counterPomodoros;

      if (counterPomodoros % cantPomodorosLongBreak === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      workSound.play();
      workSound.play();
      workSound.play();
      setMode("pomodoro");
    }
  }

  const remainingSeconds = Math.round(remainingTime);
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  const time = `${minutes}:${seconds}`;

  document.getElementById("clock").textContent = time;

  let textBreak =
    counterPomodoros % cantPomodorosLongBreak === 0
      ? "LONG BREAK"
      : "SHORT BREAK";
  const text = mode === "pomodoro" ? "FOCUS TIME" : textBreak;
  document.title = `${time} - ${text}`;
  document.getElementById("text").textContent = text;

  const progress = length == 0 ? 1 : (length - remainingTime) / length;

  document.getElementById("progress-value").style.width = progress * 100 + "vw";
}

function runTimer() {
  clearInterval(interval);
  paused = false;
  document.querySelector("#pause-button").classList.remove("active");
  updateClock();
  interval = setInterval(updateClock, 100);
}

function startTimer() {
  endTime = Date.now() + length * 1000;
  runTimer();
}

console.log(lengths);
console.log(length);
if (lengths.pomodoro && lengths.longBreak && lengths.shortBreak) {
  setMode("pomodoro");
  runTimer();
}

// startTimer();
