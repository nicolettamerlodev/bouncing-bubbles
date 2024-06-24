// DOM elements
const controls = document.querySelector(".controls");
const playBtn = controls.querySelector("#playBtn");
const bubblesContainer = document.querySelector(".bubbles");
// create bubbles
for (let i = 0; i < 48; i++)
  bubblesContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class='bubble'></div>`
  );

const bubbles = Array.from(document.querySelectorAll(".bubble"));

// colors
const bubbleColors = [
  "rgba(240, 240, 240, .6)",
  "rgba(255, 193, 127, .6)",
  "rgba(231, 250, 104, .6)",
  "rgba(136, 255, 127, .6)",
  "rgba(127, 255, 202, .6)",
  "rgba(127, 221, 255, .6)",
  "rgba(127, 170, 255, 0.6)",
  "rgba(170, 127, 255, 0.6)",
  "rgba(255, 127, 253, .6)",
  "rgba(255, 127, 217, 0.6)",
  "rgba(255, 127, 170, 0.6)"
];
// create more color shades
bubbleColors.map((color) => {
  if (color !== "rgba(240, 240, 240, .6)") {
    bubbleColors.push(tinycolor(color).saturate(12).toRgbString());
    bubbleColors.push(tinycolor(color).darken(12).toRgbString());
  }
});
// animation parameters
let animations = [];
const numbIterations = 10;
const maxDistanceX = 25;
const maxDistanceY = 15;
const bubbleMaxDim = 6.5;

function createAnimation() {
  // assign random color to each bubble
  bubbles.map((bubble) => backgroundGradient(bubble));

  // create animation for each bubble
  bubbles.map((bubble) => {
    const animation = anime
      .timeline({
        targets: bubble,
        easing: "linear",
        complete: (a) => {
          if (a.id === (bubbles.length - 1) * (a.children.length + 1))
            ["fa-pause", "fa-play"].map((cls) => playBtn.classList.toggle(cls));
        },
        loopbegin: (a) => {
          if (a.id === 0)
            ["fa-pause", "fa-play"].map((cls) => playBtn.classList.toggle(cls));
        }
      })
      .add({
        easing: "easeInOutSine",
        duration: 2000,
        scale: () => parseFloat((Math.random() * bubbleMaxDim + 4).toFixed(1))
      })
      .add({
        duration: 100000,
        keyframes: setKeyframes()
      });
    // add all animations to the array so to handle paly/stop functions
    animations.push(animation);
  });
}
// helpers functions
function backgroundGradient(bubble) {
  const randColor =
    bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const darkerColor = tinycolor(randColor).darken(20).toRgbString();
  bubble.style = `background: radial-gradient(
    circle at 75% 30%,
    rgba(245, 245, 245, .9) 1%,
    rgba(240, 240, 245, .9) 2%,
    ${randColor} 8%,
    ${darkerColor} 60%,
    ${randColor} 100%
  )`;
}
function setKeyframes() {
  const keyframesNumb = Math.floor(Math.random() * 30) + 35;
  const frames = [];
  for (let i = 0; i < keyframesNumb; i++)
    frames.push({
      translateX: setDistance(maxDistanceX),
      translateY: setDistance(maxDistanceY)
    });
  return frames;
}
function setDistance(value) {
  return Math.random() < 0.5
    ? -Math.floor(Math.random() * value)
    : Math.floor(Math.random() * value);
}

// Event listener and animation controls

controls.addEventListener("click", (e) => {
  if (e.target === playBtn) pausePlayAnimation();
  else if (e.target.id === "newBtn") startNewAnimation();
});

function pausePlayAnimation() {
  playBtn.classList.contains("fa-play")
    ? animations.map((a) => a.play())
    : animations.map((a) => a.pause());
  ["fa-pause", "fa-play"].map((cls) => playBtn.classList.toggle(cls));
}
function startNewAnimation() {
  playBtn.classList.remove("fa-pause");
  playBtn.classList.add("fa-play");

  // stop and remove current animation and start a new one
  animations.map((a) => {
    a.pause();
    a.remove();
  });
  createAnimation();
}

// initial animation
createAnimation();
