let updateAnimationFrame;
let keys = {};
let randomMessageTimer = 0;
const canvas = document.getElementById("gameCanvas");
let ctx = null;

if (canvas) {
  ctx = canvas.getContext("2d");

  // Resize canvas to fill window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

let player = {
  x: 0,
  y: 0,
  size: 20,
  speed: 2,
  frameIndex: 0,
  frameTick: 0,
  facingRight: true,
  mode: "side", 
  sleepy: 0,    
  hungry: 60,   
  isSleeping: false,
  sleepFrameIndex: 0,
  sleepDirection: 1,   
  sleepTick: 0,
  isHungry: false,
  hungryFrameIndex: 0,
  hungryTick: 0,
};

let bgIndex = 0;
let backgroundImg = new Image();
let nextBackgroundImg = new Image();
let alpha = 0;
let isFading = false;
let nightMode = false;

let mapWidth = 0;
let mapHeight = 0;

// Backgrounds
const backgrounds = [
  { src: "/assets/background/map-low-sun.png" }, 
  { src: "/assets/background/map-day.png" }, 
  { src: "/assets/background/map-low-sun.png" }, 
  { src: "/assets/background/map-night.png" }, 
];

nightMode = backgroundImg.src.includes("map-night");

// 🎯 Collision mask setup
const collisionCanvas = document.createElement("canvas");
const collisionCtx = collisionCanvas.getContext("2d", { willReadFrequently: true });

let collisionImg = new Image();
collisionImg.src = "/assets/background/map-col.png"; // white = land, black = ocean

import { gameMissionsCompletionStatus, missionRequirements, accessibleAreasByMission,setCurrentMissionIndex, gameMissions, advanceMission,currentMissionIndex, jigglyap, updateJigglyap, drawJigglyap, jigglyapDialogue, drawJigglyapDialogue, jigglyapRandomMessages, getCurrentMission, startJigglyapTypewriter, advanceJigglyapDialogue, completedMissions, loadJigglyapFrames, displayedRandomMessages } from './game.js';

// 🎨 Load Snorlax frames
const snorlaxFramesSide = [];
const snorlaxFramesFront = [];
const snorlaxFramesBack = [];
const snorlaxFramesSleep = [];
const snorlaxFramesHungry = [];

const sideFiles = ["snorlax-a-clean.png","snorlax-b-clean.png","snorlax-c-clean.png","snorlax-d-clean.png","snorlax-e-clean.png"];
const frontFiles = ["snorlax-front-a-clean.png","snorlax-front-b-clean.png","snorlax-front-c-clean.png","snorlax-front-d-clean.png","snorlax-front-e-clean.png"];
const backFiles = ["snorlax-back-a-clean.png","snorlax-back-b-clean.png","snorlax-back-c-clean.png","snorlax-back-d-clean.png","snorlax-back-e-clean.png"];
const sleepFiles = [
  "snorlax-sleep-a-clean.png",
  "snorlax-sleep-b-clean.png",
  "snorlax-sleep-c-clean.png",
  "snorlax-sleep-d-clean.png",
  "snorlax-sleep-e-clean.png"
];
const hungryFiles = [
  "snorlax-hungry-a-clean.png",
  "snorlax-hungry-b-clean.png",
  "snorlax-hungry-c-clean.png"
];

loadFrames(sideFiles, snorlaxFramesSide);
loadFrames(frontFiles, snorlaxFramesFront);
loadFrames(backFiles, snorlaxFramesBack);
loadFrames(sleepFiles, snorlaxFramesSleep);
loadFrames(hungryFiles, snorlaxFramesHungry);

let stepCycle = 0;

// 🎵 Snorlax Sound Effects
const sounds = {
  walk: new Audio("/assets/audio/walk-sound.mp3"),
  hurt: new Audio("/assets/audio/hurt-sound.mp3"),
  eat: new Audio("/assets/audio/eat-sound.mp3"),
  snore: new Audio("/assets/audio/snore-sound.mp3"),
  hungry: new Audio("/assets/audio/hungry-sound.mp3")
};

const missionSuccessSound = new Audio("/assets/audio/mission-success.mp3");

// Loop settings for continuous sounds
sounds.walk.loop = true;
sounds.snore.loop = true;
sounds.hungry.loop = true;

let isWalking = false; // track walking state

// 🎵 Music Controls
const gameMusic = document.getElementById("gameMusic");
if (gameMusic) {
  gameMusic.volume = 0.5;

  const muteBtn = document.getElementById("muteBtn");
  const volUp = document.getElementById("volUp");
  const volDown = document.getElementById("volDown");

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      gameMusic.muted = !gameMusic.muted;
      muteBtn.textContent = gameMusic.muted ? "🔇" : "🔊";
    });
  }

  if (volUp) {
    volUp.addEventListener("click", () => {
      gameMusic.volume = Math.min(1, gameMusic.volume + 0.1);
    });
  }

  if (volDown) {
    volDown.addEventListener("click", () => {
      gameMusic.volume = Math.max(0, gameMusic.volume - 0.1);
    });
  }
}

let currentArea = null;
let areaTimeout = null;

let jigglyapFound = false;

// 🍎 Item assets
const itemFiles = [
  "apple-clean.png",
  "burger-clean.png",
  "coffee-clean.png",
  "energy-drink-clean.png",
  "milk-clean.png",
  "pineapple-juice-clean.png",
  "soda-clean.png",
  "trash-clean.png"
];
const itemImages = {};
itemFiles.forEach(file => {
  const img = new Image();
  img.src = `/assets/items/${file}`;
  itemImages[file] = img;
});

let items = []; // active items on map
let itemTimer = 0;
let vanishTimer = 30; // 30s active
let respawnDelay = 5; // 5s downtime
let itemsVisible = true;

const cloudFiles = ["cloud-a-clean.png", "cloud-b-clean.png"];
const cloudImages = {};
cloudFiles.forEach(file => {
  const img = new Image();
  img.src = `/assets/cloud/${file}`;
  cloudImages[file] = img;
});

let clouds = [];
let birds = [];

export let htmlArea = "game.html"
// 🎯 Area definitions with starting points
const areas = [
  { name: "Snordax's House", color: { r: 0, g: 162, b: 232 }, startingColor: { r: 63, g: 72, b: 204 }, redirect: "snordax-house.html", startingColor: { r: 134, g: 232, b: 223 },}, // #86E8DF
  { name: "Jigglyyap's House", color: { r: 255, g: 242, b: 0 } },
  { name: "Bakery", color: { r: 185, g: 122, b: 87 }, redirect: "bakery.html", startingColor: { r: 163, g: 73, b: 164 } }, // #7F7F7F
  { name: "Store", color: { r: 237, g: 28, b: 36 }, redirect: "store.html", startingColor: { r: 136, g: 0, b: 21 } }, // #880015
  { name: "Post Office", color: { r: 34, g: 177, b: 76 }, redirect: "post-office.html", startingColor: { r: 181, g: 230, b: 29 } }, // #B5E61D
  { name: "Jigglyap Hideout", color: { r: 255, g: 174, b: 201 } }
];

loadGameState();

function canMove(x, y) {
  if (!mapWidth || !mapHeight) return true;
  if (x < 0 || y < 0 || x >= collisionCanvas.width || y >= collisionCanvas.height) {
    return false;
  }
  const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
  const isBlack = pixel[0] < 5 && pixel[1] < 5 && pixel[2] < 5;
  return !isBlack;
}

collisionImg.onload = () => {
  collisionCanvas.width = collisionImg.width;
  collisionCanvas.height = collisionImg.height;
  collisionCtx.drawImage(collisionImg, 0, 0);
  player.x = 1317;
  player.y = 519;

  spawnItems();
};

backgroundImg.onload = () => {
  mapWidth = backgroundImg.width;
  mapHeight = backgroundImg.height;
  if (canvas && ctx) update(); 
};
backgroundImg.src = backgrounds[bgIndex].src;

setInterval(() => {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  nextBackgroundImg.src = backgrounds[bgIndex].src;
  nextBackgroundImg.onload = () => {
    mapWidth = nextBackgroundImg.width;
    mapHeight = nextBackgroundImg.height;
  };
  alpha = 0;
  isFading = true;
}, 50000);

window.addEventListener("keydown", (e) => {
  if (!keys[e.key]) { 
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)) {
      player.sleepy = Math.min(100, player.sleepy + 3);
      player.hungry = Math.max(0, player.hungry + 1.5);

      //console.log(`Snordax moved (keydown)! Sleepy: ${player.sleepy}%, Hungry: ${player.hungry}%`);
    }
  }
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => (keys[e.key] = false));

function loadFrames(files, targetArray) {
  files.forEach((file) => {
    const img = new Image();
    img.src = `/assets/snorlax/${file}`;
    targetArray.push(img);
  });
}

// 🕹 Handle Movement (modified)
function handleMovement() {
  if (player.isSleeping || player.isHungry) {
    // stop walking sound if forced idle
    if (isWalking) {
      sounds.walk.pause();
      sounds.walk.currentTime = 0;
      isWalking = false;
    }
    return;
  }

  let newX = player.x;
  let newY = player.y;
  let moving = false;

  if (keys["ArrowUp"] || keys["w"]) { newY -= player.speed; moving = true; player.mode = "back"; }
  if (keys["ArrowDown"] || keys["s"]) { newY += player.speed; moving = true; player.mode = "front"; }
  if (keys["ArrowLeft"] || keys["a"]) { newX -= player.speed; player.facingRight = true; moving = true; player.mode = "side"; }
  if (keys["ArrowRight"] || keys["d"]) { newX += player.speed; player.facingRight = false; moving = true; player.mode = "side"; }

  if (canMove(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }

  if (moving) {
    // 🔊 Start walking sound if not already playing
    if (!isWalking) {
      sounds.walk.play();
      isWalking = true;
    }

    if (player.frameTick === 0) {
      stepCycle = (stepCycle + 1) % 3;
      if (stepCycle === 0) player.frameIndex = 0;
      else if (stepCycle === 1) player.frameIndex = 1;
      else if (stepCycle === 2) player.frameIndex = 3;
    }
    player.frameTick = (player.frameTick + 1) % 25;

  } else {
    player.frameIndex = 0;
    player.frameTick = 0;
    stepCycle = 0;

    // 🔊 Stop walking sound when idle
    if (isWalking) {
      sounds.walk.pause();
      sounds.walk.currentTime = 0;
      isWalking = false;
    }
  }
}

function getCamera() {
  let camX = player.x - canvas.width / 2;
  let camY = player.y - canvas.height / 2;
  camX = Math.max(0, Math.min(camX, mapWidth - canvas.width));
  camY = Math.max(0, Math.min(camY, mapHeight - canvas.height));
  return { camX, camY };
}

function drawBackground(camX, camY) {
  ctx.globalAlpha = 1;
  ctx.drawImage(backgroundImg, -camX, -camY);
  if (isFading) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(nextBackgroundImg, -camX, -camY);
    ctx.globalAlpha = 1;
    alpha += 0.01;
    if (alpha >= 1) { backgroundImg = nextBackgroundImg; isFading = false; }
  }
}

function drawPlayer(camX, camY) {
  const imgSize = 270;
  let frame;

  if (player.isSleeping) {
    // 💤 Sleeping animation
    if (player.sleepTick === 0) {
      player.sleepFrameIndex += player.sleepDirection;
      if (player.sleepFrameIndex >= snorlaxFramesSleep.length - 1) {
        player.sleepDirection = -1;
        player.sleepFrameIndex = snorlaxFramesSleep.length - 1;
      } else if (player.sleepFrameIndex <= 3) {
        player.sleepDirection = 1;
        player.sleepFrameIndex = 3;
      }
    }
    player.sleepTick = (player.sleepTick + 1) % 120; 
    frame = snorlaxFramesSleep[player.sleepFrameIndex];

  } else if (player.isHungry) {
    // 🍗 Hungry animation loop
    if (player.hungryTick === 0) {
      if (player.hungryFrameIndex === 0) {
        // First time, move from A to B
        player.hungryFrameIndex = 1;
      } else {
        // After A, loop B ↔ C
        if (player.hungryFrameIndex === 1) {
          player.hungryFrameIndex = 2; // B → C
        } else {
          player.hungryFrameIndex = 1; // C → B
        }
      }
    }
    player.hungryTick = (player.hungryTick + 1) % 30; // change every 0.5s (60fps)
  frame = snorlaxFramesHungry[player.hungryFrameIndex];

  } else if (player.isBlinking) {
    ctx.globalAlpha = ctx.globalAlpha === 1 ? 0.3 : 1;
  }
  else {
      // 😴 Normal walking/idle
      let frames = snorlaxFramesSide;
      if (player.mode === "front") frames = snorlaxFramesFront;
      else if (player.mode === "back") frames = snorlaxFramesBack;

      frame = frames[player.frameIndex];
    }

  if (!frame || !frame.complete) return;

  ctx.save();
  ctx.translate(player.x - camX, player.y - camY);
  if(nightMode) ctx.filter = "brightness(10%)"; 
  if (player.mode === "side" && !player.facingRight && !player.isSleeping && !player.isHungry) {
    ctx.scale(-1, 1);
    ctx.drawImage(frame, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
  } else {
    ctx.drawImage(frame, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
  }
  ctx.restore();
}

function findPixelByColor(targetColor) {
  if (!collisionCtx) return { x: 0, y: 0 };

  const imageData = collisionCtx.getImageData(0, 0, mapWidth, mapHeight);
  const data = imageData.data;

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const index = (y * mapWidth + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      if (
        Math.abs(r - targetColor.r) < 10 &&
        Math.abs(g - targetColor.g) < 10 &&
        Math.abs(b - targetColor.b) < 10
      ) {
        return { x, y };
      }
    }
  }

  // fallback if color not found
  return { x: 0, y: 0 };
}

function checkArea() {
  if (!mapWidth || !mapHeight) return;

  // Get the pixel color under the player
  const pixel = collisionCtx.getImageData(player.x, player.y, 1, 1).data;
  const [r, g, b] = pixel;
  let foundArea = null;

  // Find which area the player is currently on
  for (const area of areas) {
    if (
      Math.abs(r - area.color.r) < 10 &&
      Math.abs(g - area.color.g) < 10 &&
      Math.abs(b - area.color.b) < 10
    ) {
      foundArea = area;
      break;
    }
  }

  if (!foundArea) return;

  // Only allow areas that are accessible for the current mission
  const allowedAreas = accessibleAreasByMission[currentMissionIndex] || [];
  if (!allowedAreas.includes(foundArea.name)) {
    showAreaDialog(foundArea.name);
    return;
  }

  // If the player has moved to a new area
  if (foundArea.name !== currentArea) {
    currentArea = foundArea.name;
    showAreaDialog(foundArea.name);

    if(currentArea.name == "Jigglyap's Hideout") return;

    const requiredAreas = missionRequirements[currentMissionIndex] || [];

    // ✅ Check if this area is required for current mission
    if (requiredAreas.includes(foundArea.name) && !completedMissions.includes(currentMissionIndex)) {
      // Mark as visited so mission can complete after returning from HTML
      localStorage.setItem(`missionVisited-${currentMissionIndex}`, "true");

      // Redirect to area HTML if available
      if (foundArea.redirect) {
        localStorage.setItem("lastAreaName", foundArea.name);
        saveGameState();
        stopGameActivities();
        setTimeout(() => {
          window.location.href = foundArea.redirect;
        }, 800);
      } 
    } else if (foundArea.redirect) {
      // Non-required area that is allowed → just redirect
      localStorage.setItem("lastAreaName", foundArea.name);
      htmlArea = foundArea.name;
      saveGameState();
      setTimeout(() => {
        stopGameActivities();
        window.location.href = foundArea.redirect;
      }, 800);
    }
  }
}

export function setHtmlArea(area) {
  htmlArea = area;
}


function stopGameActivities() {
  cancelAnimationFrame(updateAnimationFrame);

  // Stop sounds
  Object.values(sounds).forEach(snd => { snd.pause(); snd.currentTime = 0; });
  jpSounds.sing.pause();
  jpSounds.sing.currentTime = 0;
  jpSounds.angry.pause();
  jpSounds.angry.currentTime = 0;

  // Clear intervals/timers
  if (player.blinkInterval) clearInterval(player.blinkInterval);
  clearTimeout(areaTimeout);

  // Stop dialogue
  jigglyapDialogue.active = false;

  // Stop items
  itemTimer = 0;
  itemsVisible = false;
}

function checkJigglyapArea() {
  if (!mapWidth || !mapHeight || jigglyap.visible) return;
  const pixel = collisionCtx.getImageData(player.x, player.y, 1, 1).data;
  const [r,g,b] = pixel;

  if (Math.abs(r-255)<10 && Math.abs(g-174)<10 && Math.abs(b-201)<10) {
    if (!jigglyapFound) {
      jigglyapFound = true;
      jigglyap.visible = true;

      // ✅ Show dialogue first, but DON'T complete mission yet
      jigglyapDialogue.active = true;
      jigglyapDialogue.lines = gameMissionsCompletionStatus[0].completionDialogue;
      jigglyapDialogue.currentLine = 0;
      startJigglyapTypewriter(jigglyapDialogue.lines[0]);

      gameMissionsCompletionStatus[0].complete = true;

      // 👇 delay mission complete until dialogue finishes
      jigglyapDialogue.onFinish = () => {
        completeMission();
      };
    }

    if (jigglyap.x === 0 && jigglyap.y === 0) {
      jigglyap.x = player.x + jigglyap.offsetX;
      jigglyap.y = player.y + jigglyap.offsetY;
    }
  }
}

function showAreaDialog(text) {
  const dialogBox = document.getElementById("dialogBox");
  dialogBox.textContent = text;
  dialogBox.classList.add("show");
  if (areaTimeout) clearTimeout(areaTimeout);
  areaTimeout = setTimeout(() => { dialogBox.classList.remove("show"); }, 3000);
}

// 💤🍗 Status System (modified to trigger sleep/hungry sounds)
function checkStatus() { 
  const statusMessage = document.getElementById("statusMessage"); 
  const sleepyFill = document.getElementById("sleepyFill"); 
  const hungryFill = document.getElementById("hungryFill"); 
  
  sleepyFill.style.width = player.sleepy + "%"; 
  hungryFill.style.width = player.hungry + "%"; 
  
  let msg = ""; 
  
  if (player.sleepy >= 80 && !player.isSleeping) { 
    player.speed = 1; msg = "Snordax is very sleepy..."; 
  } else if (player.sleepy >= 60 && !player.isSleeping) { 
    msg = "Snordax is getting tired!"; 
  } else { player.speed = 2; } 
  
  if (player.hungry >= 80 && !player.isHungry) { 
    player.speed = 1; msg = "Snordax is starving..."; 
  } else if (player.hungry >= 40 && !player.isHungry) { 
    msg = "Snordax is getting hungry!"; 
  } 

  if (player.sleepy >= 100 && !player.isSleeping) { 
    player.isSleeping = true; 
    player.pauseTimer = 20; 
    msg = "Snordax fell asleep!"; 
    sounds.snore.play(); // 🔊 Start snore sound
  } 

  if (player.hungry >= 100 && !player.isHungry) { 
    player.isHungry = true; 
    player.pauseTimer = 10; 
    msg = "Snordax is too hungry!"; 
    sounds.hungry.play(); // 🔊 Start hungry sound
  } 

  if (player.isSleeping || player.isHungry) { 
    msg = (player.isSleeping ? "Snordax is sleeping... " : "Snordax is mad... ") + Math.ceil(player.pauseTimer) + "s"; 
  } 
  
  statusMessage.textContent = msg; 
}

function distance(ax, ay, bx, by) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function drawItems(camX, camY) {
  items.forEach(item => {
    if (!item.img.complete) return;
    const size = 64 * item.scale; // default 64px, scaled
    ctx.save();

    if (nightMode) ctx.filter = "brightness(10%)";

    ctx.globalAlpha = item.alpha;
    ctx.drawImage(item.img, item.x - camX - size/2, item.y - camY - size/2, size, size);
    ctx.restore();
  });
}

function spawnItems() {
  if (!canvas) return;
  items = [];
  const needed = 12;
  const assetPool = [
    "apple-clean.png",
    "burger-clean.png",
    "coffee-clean.png",
    "energy-drink-clean.png",
    "milk-clean.png",
    "pineapple-juice-clean.png",
    "soda-clean.png"
  ];

  for (let i = 0; i < needed; i++) {
    let file = assetPool[i] || "trash-clean.png";

    let x, y, pixel, tooClose;
    do {
      x = Math.floor(Math.random() * collisionCanvas.width);
      y = Math.floor(Math.random() * collisionCanvas.height);
      pixel = collisionCtx.getImageData(x, y, 1, 1).data;

      tooClose = items.some(it => distance(x, y, it.x, it.y) < 100);
    } while (
      !(Math.abs(pixel[0] - 255) < 10 && Math.abs(pixel[1] - 127) < 10 && Math.abs(pixel[2] - 39) < 10) ||
      distance(x, y, player.x, player.y) < 150 ||
      tooClose
    );

    items.push({
      x, y,
      img: itemImages[file],
      scale: 0,
      alpha: 0,
      state: "appearing",
      appearSpeed: 0.03 + Math.random() * 0.04,
      vanishSpeed: 0.03 + Math.random() * 0.04,
      delay: Math.floor(Math.random() * 20),
      pulseDir: 1,          // grow (1) or shrink (-1)
      pulseSpeed: 0.005 + Math.random() * 0.003 // subtle variation
    });

  }
}

function updateItems() {
  items.forEach(item => {
    if (item.delay > 0) {
      item.delay--;
      return; // wait before animating
    }

    if (item.state === "appearing") {
      item.scale += item.appearSpeed;
      item.alpha += item.appearSpeed;
      if (item.scale >= 1) { 
        item.scale = 1; 
        item.alpha = 1; 
        item.state = "pulsing"; // 🔥 switch to pulsing
      }

    } else if (item.state === "pulsing") {
      // Smooth grow-shrink loop between 0.9 and 1.1
      item.scale += item.pulseDir * item.pulseSpeed;

      if (item.scale >= 1.1) { 
        item.scale = 1.1; 
        item.pulseDir = -1; // start shrinking
      }
      if (item.scale <= 0.9) { 
        item.scale = 0.9; 
        item.pulseDir = 1;  // start growing
      }

    } else if (item.state === "vanishing") {
      item.scale -= item.vanishSpeed;
      item.alpha -= item.vanishSpeed;
      if (item.scale <= 0) { item.scale = 0; item.alpha = 0; }
    }
  });
}

function checkItemCollisions() {
  const { camX, camY } = getCamera();

  items.forEach((item, index) => {
    if (!item.img.complete) return;

    const size = 64 * item.scale;
    const dx = (player.x - item.x);
    const dy = (player.y - item.y);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < (player.size + size / 2)) {
      // 🎯 Snorlax touched an item
      const itemName = Object.keys(itemImages).find(key => itemImages[key] === item.img);

      applyItemEffect(itemName);

      // Remove item from map
      items.splice(index, 1);

      // Show dialog
      if (itemName === "trash-clean.png") {
        showAreaDialog("Snordax is hurt by other people's trash. Give love to Snordax.");
      } else {
        const cleanName = itemName.replace("-clean.png", "").replace("-", " ");
        showAreaDialog(`Snordax enjoyed the ${cleanName}.`);
      }
    }
  });
}

// 🎯 Apply Item Effects (modified to add sound)
function applyItemEffect(itemName) {
  switch (itemName) {
    case "trash-clean.png":
      sounds.hurt.play();
      player.isPaused = true;
      player.pauseTimer = 5;
      let blinkInterval = setInterval(() => {
        player.isBlinking = !player.isBlinking;
      }, 200);

      setTimeout(() => {
        clearInterval(blinkInterval);
        player.isBlinking = false;
        player.isPaused = false;
      }, 5000);
      break;

    default:
      sounds.eat.play();
      break;
  }

  // (existing item effects code continues below...)
  switch (itemName) {
    case "apple-clean.png":
      player.sleepy = 0;
      player.hungry = 0; //0 from 100
      break;
    case "burger-clean.png":
      player.hungry = 0; // 0 from 100
      player.sleepy = Math.min(100, player.sleepy + 20);
      break;
    case "coffee-clean.png":
      player.sleepy = 0;
      player.hungry = Math.min(100, player.hungry + 20);
      break;
    case "energy-drink-clean.png":
      player.sleepy = 0;
      player.hungry = 100; // 100 from 0
      player.isHungry = true;
      player.pauseTimer = 10;
      
      sounds.hungry.play();
      break;
    case "soda-clean.png":
      player.hungry = 100; // 100 from 0
      player.isHungry = true;
      player.pauseTimer = 10; 
      sounds.hungry.play();

      player.sodaEffect = true;
      break;
    case "pineapple-juice-clean.png":
      player.hungry = 0; // 0 from 100
      break;
    case "milk-clean.png":
      player.sleepy = 100;
      player.isSleeping = true;
      player.pauseTimer = 20;
      sounds.snore.play();
      break;
  }
}

function spawnCloud() {
  if (!canvas) return;
  const file = cloudFiles[Math.floor(Math.random() * cloudFiles.length)];
  const direction = Math.random() < 0.5 ? "left" : "right";
  const speed = 0.2 + Math.random() * 0.3; // slow horizontal speed
  const scale = 0.5 + Math.random() * 0.5; // size between 0.5–1

  const x = direction === "right" ? -100 : canvas.width + 100;
  const y = Math.random() * canvas.height / 3; // clouds appear in top 1/3

  clouds.push({
    img: cloudImages[file],
    x,
    y,
    scale,
    speed,
    direction
  });
}

// Spawn initial clouds
for (let i = 0; i < 5; i++) spawnCloud();

function updateClouds() {
  clouds.forEach(cloud => {
    if (cloud.direction === "right") cloud.x += cloud.speed;
    else cloud.x -= cloud.speed;

    // Respawn when out of screen
    if (cloud.x > canvas.width + 200 && cloud.direction === "right") {
      cloud.x = -100;
      cloud.y = Math.random() * canvas.height / 3;
    } else if (cloud.x < -200 && cloud.direction === "left") {
      cloud.x = canvas.width + 100;
      cloud.y = Math.random() * canvas.height / 3;
    }
  });
}

function drawClouds(camX, camY) {
  if (backgrounds[bgIndex].src.includes("map-day")) {
    clouds.forEach(cloud => {
      if (!cloud.img.complete) return;
      const w = cloud.img.width * cloud.scale;
      const h = cloud.img.height * cloud.scale;

      ctx.save();
      ctx.translate(cloud.x - camX, cloud.y - camY);

      if (cloud.direction === "left") ctx.scale(-1, 1); // flip horizontally
      ctx.drawImage(cloud.img, cloud.direction === "left" ? -w : 0, 0, w, h);

      ctx.restore();
    });
  }
}

function isLowSun() {
  return bgIndex === 0 || bgIndex === 2; 
}

const birdFiles = {
  brown: ["bird-brown-a-clean.png", "bird-brown-b-clean.png"],
  red: ["bird-red-a-clean.png", "bird-red-b-clean.png"]
};
const birdImages = { brown: [], red: [] };

for (const color in birdFiles) {
  birdFiles[color].forEach(file => {
    const img = new Image();
    img.src = `/assets/bird/${file}`;
    birdImages[color].push(img);
  });
}

function spawnBird() {
  if (!canvas) return;
  const colors = ["brown", "red"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const direction = Math.random() < 0.5 ? "right" : "left";
  const speed = 0.5 + Math.random() * 1; // random speed
  const y = Math.random() * canvas.height * 0.7; // anywhere vertically except bottom 30%
  const x = direction === "right" ? -50 : canvas.width + 50;
  
  // Random height between 30–50px
  const height = 30 + Math.random() * 20;

  birds.push({
    color,
    direction,
    x,
    y,
    speed,
    height,       // store the fixed random height
    frameIndex: 0,
    frameTick: 0
  });
}

// spawn 3-5 birds initially
for (let i = 0; i < 4; i++) spawnBird();

function updateBirds() {
  if (!isLowSun()) return;

  while (birds.length < 3) spawnBird();           
  while (birds.length > 6) birds.pop();

  birds.forEach((bird, index) => {
    // Move bird
    if (bird.direction === "right") bird.x += bird.speed;
    else bird.x -= bird.speed;

    // Animate frames (flip every 15 ticks)
    bird.frameTick = (bird.frameTick + 1) % 15;
    if (bird.frameTick === 0) bird.frameIndex = (bird.frameIndex + 1) % 2;

    // Remove if out of screen
    if (bird.x > canvas.width + 100 && bird.direction === "right") birds.splice(index, 1);
    else if (bird.x < -100 && bird.direction === "left") birds.splice(index, 1);
  });

  // Occasionally spawn new bird
  if (Math.random() < 0.005) spawnBird();
}

function drawBirds(camX, camY) {
  if (!isLowSun()) return;

  birds.forEach(bird => {
    const frames = birdImages[bird.color];
    const frame = frames[bird.frameIndex];
    if (!frame.complete || frame.naturalWidth === 0) return;

    const aspectRatio = frame.width / frame.height;
    const w = bird.height * aspectRatio;  // width based on stored height
    const h = bird.height;

    ctx.save();
    ctx.translate(bird.x - camX, bird.y - camY);
    if (bird.direction === "left") ctx.scale(-1, 1);
    ctx.drawImage(frame, bird.direction === "left" ? -w : 0, 0, w, h);
    ctx.restore();
  });
}

export function saveGameState() {
  const gameState = {
    player: {
      x: player.x,
      y: player.y,
      size: player.size,
      speed: player.speed,
      frameIndex: player.frameIndex,
      mode: player.mode,
      facingRight: player.facingRight,
      sleepy: player.sleepy,
      hungry: player.hungry,
      isSleeping: player.isSleeping,
      isHungry: player.isHungry,
      sleepFrameIndex: player.sleepFrameIndex,
      sleepDirection: player.sleepDirection,
      sleepTick: player.sleepTick,
      hungryFrameIndex: player.hungryFrameIndex,
      hungryTick: player.hungryTick,
      pauseTimer: player.pauseTimer,
      sodaEffect: player.sodaEffect
    },
    jigglyap: {
      x: jigglyap.x,
      y: jigglyap.y,
      visible: jigglyap.visible,
      mode: jigglyap.mode,
      frameIndex: jigglyap.frameIndex
    },
    bgIndex: bgIndex,
    currentMissionIndex: currentMissionIndex,
    musicVolume: gameMusic ? gameMusic.volume : 0.5,
    musicMuted: gameMusic ? gameMusic.muted : false,
    randomMessageTimer: randomMessageTimer,
    gameMissionsCompletionStatus: gameMissionsCompletionStatus,
    htmlArea:htmlArea,
    displayedRandomMessages: displayedRandomMessages,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
  console.log("ENTERED SAVEGAMESTATE");
  console.log(gameState);
}

export function loadGameState() {
    const savedState = localStorage.getItem("gameState");
    if (!savedState) return;

    const gameState = JSON.parse(savedState);
    console.log("ENTERED LOADGAMESTATE");
    console.log(gameState);

    // Restore player state
    Object.assign(player, gameState.player);

    // Restore Jigglyap basic state
    Object.assign(jigglyap, gameState.jigglyap);

    jigglyap.frames = { side: [], front: [], back: [], sing: [], angry: [] }; // reset
    loadJigglyapFrames(); // fills the frame arrays
    jigglyap.defaultFrame = jigglyap.frames.front[0]; // set idle frame
    jigglyap.frameTick = 0; // reset animation tick
    jigglyap.frameIndex = 0; // start at first frame

    // Restore other global states
    bgIndex = gameState.bgIndex;
    setCurrentMissionIndex(gameState.currentMissionIndex);

    if (gameMusic) {
        gameMusic.volume = gameState.musicVolume;
        gameMusic.muted = gameState.musicMuted;
    }

    randomMessageTimer = gameState.randomMessageTimer;
    
    // Restore displayed random messages without reassigning
    displayedRandomMessages.length = 0;
    if (gameState.displayedRandomMessages && gameState.displayedRandomMessages.length > 0) {
        displayedRandomMessages.push(...gameState.displayedRandomMessages);
    }

    // Make Jigglyap visible if player is past mission 0
    if (currentMissionIndex > 0) {
        jigglyap.visible = true;
    }

    // Restore mission completion status
    if (gameState.gameMissionsCompletionStatus) {
        Object.keys(gameState.gameMissionsCompletionStatus).forEach(index => {
            gameMissionsCompletionStatus[index] = gameState.gameMissionsCompletionStatus[index];
        });
    }

    console.log("Jigglyap restored:", jigglyap);


    if ( gameState.gameMissionsCompletionStatus && gameState.gameMissionsCompletionStatus[currentMissionIndex] && gameState.gameMissionsCompletionStatus[currentMissionIndex].complete &&!gameState.gameMissionsCompletionStatus[currentMissionIndex].shown) {
        finalMissionDialogue(gameState);
    }

}

function finalMissionDialogue(gameState){
  const missionData = gameState.gameMissionsCompletionStatus[currentMissionIndex];
  if (!missionData) return;

  jigglyapDialogue.active = true;
  jigglyapDialogue.lines = missionData.completionDialogue; 
  jigglyapDialogue.currentLine = 0;
  startJigglyapTypewriter(jigglyapDialogue.lines[0]);

  jigglyapDialogue.onFinish = () => {
      completeMission();
  };
}

// 🎮 Update loop (Jigglyap improvements)
function update() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleMovement();
  const { camX, camY } = getCamera();
  drawBackground(camX, camY);
  checkArea();

  drawPlayer(camX, camY);

  checkJigglyapArea();

  updateJigglyap(player, keys);
  drawJigglyap(ctx, camX, camY, keys, nightMode);

  updateItems();     
  drawItems(camX, camY);

  updateBirds();
  drawBirds(camX, camY);

  updateClouds();
  drawClouds(camX, camY);

  // ⏳ Handle Sleeping / Hungry countdown
  if (player.isSleeping || player.isHungry) {
      if (player.pauseTimer > 0) {
          // Decrement pauseTimer
          player.pauseTimer -= 1 / 60;

          // === Sleeping drain ===
          if (player.isSleeping) {
              // Gradually decrease sleepy from 100 → 0
              const sleepDuration = 20; // total sleep duration in seconds
              player.sleepy = Math.max(0, Math.floor((player.pauseTimer / sleepDuration) * 100));

              // Jigglyap sing logic
              if (jigglyap.visible && jigglyap.mode !== "sing") {
                  if (jigglyap.mode === "angry") {
                      jpSounds.angry.pause();
                      jpSounds.angry.currentTime = 0;
                  }
                  jigglyap.prevMode = jigglyap.mode;
                  jigglyap.mode = "sing";
                  jigglyap.frameIndex = 0;
                  jpSounds.sing.currentTime = 0;
                  jpSounds.sing.play();
              }

              // animate sing frames
              jigglyap.frameTick = (jigglyap.frameTick + 1) % 20;
              if (jigglyap.frameTick === 0) {
                  jigglyap.frameIndex = (jigglyap.frameIndex + 1) % jigglyap.frames.sing.length;
              }
          }

          // === Hungry drain ===
          if (player.isHungry) {
              const hungryMin = 50; // minimum value during hunger
              const hungryDuration = 10; // total hungry duration in seconds
              player.hungry = Math.max(hungryMin, Math.floor(hungryMin + (player.pauseTimer / hungryDuration) * 50));

              // Jigglyap angry logic
              if (jigglyap.visible && jigglyap.mode !== "angry") {
                  if (jigglyap.mode === "sing") {
                      jpSounds.sing.pause();
                      jpSounds.sing.currentTime = 0;
                  }
                  jigglyap.prevMode = jigglyap.mode;
                  jigglyap.mode = "angry";
                  jigglyap.frameIndex = 0;
                  jpSounds.angry.currentTime = 0;
                  jpSounds.angry.play();
              }

              // animate angry frames
              jigglyap.frameTick = (jigglyap.frameTick + 1) % 20;
              if (jigglyap.frameTick === 0) {
                  jigglyap.frameIndex = (jigglyap.frameIndex + 1) % jigglyap.frames.angry.length;
              }
          }

      } else {
          // ⏹ PauseTimer ended → reset states
          if (player.isSleeping) {
              player.isSleeping = false;
              player.sleepy = 0;
              player.sleepFrameIndex = 0;
              player.sleepDirection = 1;
              player.sleepTick = 0;
              sounds.snore.pause();
              sounds.snore.currentTime = 0;
          }

          if (player.isHungry) {
              player.isHungry = false;
              player.hungry = 50; // stop at 50
              sounds.hungry.pause();
              sounds.hungry.currentTime = 0;

              // soda effect triggers sleep chain
              if (player.sodaEffect) {
                  if (jigglyap.mode === "angry") {
                      jpSounds.angry.pause();
                      jpSounds.angry.currentTime = 0;
                  }
                  player.isSleeping = true;
                  player.pauseTimer = 20;
                  sounds.snore.play();
                  player.sodaEffect = false;
              }
          }

          player.speed = 2;
      }
  } else {
    if (jigglyap.mode === "sing") {
      jpSounds.sing.pause();
      jpSounds.sing.currentTime = 0;
      jigglyap.mode = jigglyap.prevMode || "front";
    }
    if (jigglyap.mode === "angry") {
      jpSounds.angry.pause();
      jpSounds.angry.currentTime = 0;
      jigglyap.mode = jigglyap.prevMode || "front";
    }
  }

  // 🎁 Item respawn / vanish cycle
  itemTimer += 1 / 60;
  if (itemsVisible && itemTimer >= vanishTimer) {
    items.forEach(item => item.state = "vanishing");
    itemsVisible = false;
    itemTimer = 0;
  } else if (!itemsVisible && itemTimer >= respawnDelay) {
    spawnItems();
    itemsVisible = true;
    itemTimer = 0;
  }

  // Random messages every 20 seconds
  randomMessageTimer += 1/60;
  if (randomMessageTimer >= 20) {
      if (jigglyap.visible && !jigglyapDialogue.active) {
          
          const availableMessages = jigglyapRandomMessages.filter((_, i) => !displayedRandomMessages.includes(i));

          let messageIndex;
          if (availableMessages.length === 0) {
              // All messages shown → reset
              displayedRandomMessages = [];
              messageIndex = Math.floor(Math.random() * jigglyapRandomMessages.length);
          } else {
              // Pick a random available message
              const rand = Math.floor(Math.random() * availableMessages.length);
              messageIndex = jigglyapRandomMessages.indexOf(availableMessages[rand]);
          }

          // Mark this message as displayed
          displayedRandomMessages.push(messageIndex);

          const line = jigglyapRandomMessages[messageIndex];

          jigglyapDialogue.lines = [line];
          jigglyapDialogue.currentLine = 0;
          jigglyapDialogue.active = true;

          // Start typewriter effect + talking sound
          startJigglyapTypewriter(line);
          saveGameState();
          
      }

      randomMessageTimer = 0;
  }

  checkStatus();
  checkItemCollisions();

  drawCursor();
  drawJigglyapDialogue(ctx, camX, camY);
  updateAnimationFrame = requestAnimationFrame(update);
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    canvas.addEventListener('click', () => {
      // Only advance Jigglyap's dialogue through the dedicated function
      if (!jigglyapDialogue.active) return;
      advanceJigglyapDialogue();
    });
  }
});


let notesIcon = document.getElementById("notesIcon");
let notesModal = document.getElementById("notesModal");
let closeNotes = document.getElementById("closeNotes");
let missionList = document.getElementById("missionList");

document.addEventListener("DOMContentLoaded", () => {
  if (notesIcon) {
    notesIcon.addEventListener("click", () => {
      updateMissionList();
      notesModal.style.display = "block";
    });
  }

  if (closeNotes) {
    closeNotes.addEventListener("click", () => {
      notesModal.style.display = "none";
    });
  }
});

function updateMissionList() {
  if (!canvas || !ctx) return;
  missionList.innerHTML = "";

  for (let i = 0; i <= currentMissionIndex; i++) {
    const mission = gameMissions[i];
    const mission2 = gameMissionsCompletionStatus[i].goal;
    const li = document.createElement("li");
    li.textContent = mission2;
    console.log("ENTERED UPDATE MISSION LIST")
    console.log(currentMissionIndex);
    console.log(li.textContent);

    if (i < currentMissionIndex) {
      li.classList.add("completed"); // crossed out
    } else if (i === currentMissionIndex) {
      li.classList.add("current");   // highlighted
    }

    missionList.appendChild(li);
  }
}

function showMission() {
  if (!canvas || !ctx) return;
  const modal = document.getElementById("notesModal");

  updateMissionList();
  modal.style.display = "block";
  // console.log(`Current Mission Index: ${currentMissionIndex}%, GameMission: ${gameMissions[currentMissionIndex]}%`);
}

function completeMission() {
  let prevIndex = currentMissionIndex;
  if (!canvas || !ctx) return;
  console.log("ENTERED COMPLETE MISSION")
  console.log(gameMissionsCompletionStatus);
  if(!gameMissionsCompletionStatus[currentMissionIndex].shown){
    missionSuccessSound.currentTime = 0; 
    missionSuccessSound.play(); 
    console.log("ENTERED COMPLETE MISSION not yet shown")
    console.log(gameMissionsCompletionStatus);
    advanceMission();
    gameMissionsCompletionStatus[prevIndex].shown = true; 
    saveGameState();
  }  
  showMission();   
}

window.onload = () => {
  console.log("Mission Index:", currentMissionIndex);

  if (typeof loadGameState === "function") {
    loadGameState();
  }


  const lastAreaName = localStorage.getItem("lastAreaName");
  if (lastAreaName) {
    const area = areas.find(a => a.name === lastAreaName);
    if (area && area.startingColor) {
      const startPos = findPixelByColor(area.startingColor);
      player.x = startPos.x;
      player.y = startPos.y;
    }
  } else {
    player.x = 1300;
    player.y = 500;
  }

  if (typeof updateMissionList === "function") updateMissionList();
  if (typeof showMission === "function" && currentMissionIndex == 0) showMission();
  if (typeof checkArea === "function") checkArea();

  // ✅ Restart game loop
  update();
};

const cursorImg = new Image();
cursorImg.src = "/assets/ui/cursor-clean.png"; 

const cursor = document.createElement("img");
cursor.src = "/assets/ui/cursor-clean.png";
cursor.style.position = "fixed";
cursor.style.pointerEvents = "none"; // important! so it doesn't block clicks
cursor.style.zIndex = "9999"; // always on top
cursor.style.width = "32px"; // adjust size
cursor.style.height = "32px";
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

function drawCursor() {
  if (!cursorImg.complete) return;
  ctx.drawImage(cursorImg, cursor.x, cursor.y, 32, 32);
}

const jpSounds = {
  sing: new Audio("/assets/audio/jp-singing.mp3"),
  angry: new Audio("/assets/audio/jp-angry.mp3")
};


jpSounds.sing.loop = true;   // keep looping until sleep ends
jpSounds.angry.loop = true;  // keep looping until hunger ends

// Exit button logic
const exitBtn = document.getElementById("exitBtn");
if (exitBtn) {
  exitBtn.addEventListener("click", () => {
    // Clear saved game state
    localStorage.removeItem("gameState");
    localStorage.removeItem("lastAreaName");

    // Redirect back to login
    window.location.href = "index.html";
  });
}
