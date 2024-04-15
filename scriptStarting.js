const urlParams = new URLSearchParams(window.location.search);

const lengths = {
  starting: (Number(urlParams.get("starting")) || 10) * 60,
};

const breakSound = new Audio("sounds/break.mp3");
const workSound = new Audio("sounds/work.mp3");

let mode;
let interval;
let length;
let paused;
let remainingTime;
let endTime;

document.getElementById("text").textContent = "El stream comenzará en:";

function updateClock() {
  remainingTime = (endTime - Date.now()) / 1000;
  if (remainingTime <= 0) {
    breakSound.play();
    breakSound.play();
    breakSound.play();

    remainingTime = 0;
    clearInterval(interval);
    interval = null;

    document.getElementById("text").textContent = "\n\n¡A trabajar!\n";
    document.title = "¡A trabajar!";

    


  }

  const remainingSeconds = Math.round(remainingTime);
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  const time = `${minutes}:${seconds}`;

  document.getElementById("clock").textContent = time;

  const progress = length == 0 ? 1 : (length - remainingTime) / length;

  document.getElementById("progress-value").style.width = progress * 100 + "vw";
}

function runTimer() {
  clearInterval(interval);
  paused = false;
  updateClock();
  interval = setInterval(updateClock, 100);
}

function startTimer() {
  endTime = Date.now() + length * 1000;
  runTimer();
}

console.log(lengths);
console.log(length);
if (lengths.starting) {
  length = lengths.starting;
  console.log(length);

  startTimer();
}
