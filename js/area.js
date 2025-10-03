import { htmlArea ,saveGameState, setHtmlArea } from './script.js'; // adjust path if needed
import { gameMissionsCompletionStatus, advanceMission, currentMissionIndex } from './game.js';


// ----------------- DOM Elements -----------------
const backBtn = document.getElementById("back-btn");
const dialogueBox = document.getElementById("dialogue-box");
const dialogueText = document.getElementById("dialogue-text");
const nextBtn = document.getElementById("next-btn");
const character = document.getElementById("character");

// ----------------- Dialogue Data -----------------
export const bakeryDialogue = [
  { text: "Nice to see you! What do you need? I have all kinds of bread and desserts." },
  { text: "Oh, Jigglyap wants a cake… I see. Let me check in the back. I might have one." },
  { 
    event: "openModal",
    modal: {
      title: "Birthday Cake",
      video: "bakery/cake.mp4",
      loop: true,
      closeAfterFirstPlay: true
    }
  },
  { text: "I baked that with love. Enjoy the cake! See you next time, bye." },
  {
    event: "completeTheMission",
    missionIndex: 1  // bakery mission
  }
];

export const storeDialogue = [
  { text: "Aloha! It's nice to see you awake, Snordax." },
  { text: "What do you need?" },
  { text: "You're looking for a candle… hmm. Let me think." },
  { text: "Aha! I have the perfect candle in mind." },
  { 
    event: "openModal", 
    modal: {
      title: "Find the Candle",
      subtitle: "Tap the different parts of the image to look for the candle.",
      image: "store/candle.jpg"
    }
  },
  { text: "Great job finding the best candle in town! Use it well. See ya!" },
  {
    event: "completeTheMission",
    missionIndex: 2
  }
];

export const postOfficeDialogue = [
  { text: "Hey, Snordax and Jigglyap. Wanna see my package?" },
  { text: "Haha! You got me. I have a letter for you. But do you want to see your package, Snordax? When are you planning to…" },
  { text: "K fine! Just come here and give me your package anytime, Snordax." },
  { text: "Perfect! Hihi. Now let me get the letter." },
  { 
    event: "openModal",
    modal: {
      title: "Letter Delivery",
      video: "post-office/mail.mp4",
      loop: true,
      closeAfterFirstPlay: true
    }
  },
  { text: "Whew, that was a workout! Haha. Did you enjoy it, Snordax?" },
  { text: "Really? Then will you come back tomorrow?" },
  { text: "I would be happy if you will. Anyway, I’ve got some work to do. Babye!" },
  {
    event: "completeTheMission",
    missionIndex: 3
  }
];

export const birthdayDialogue = [
  { text: "Surprise, Snordax!!!! HAPPY BIRTHDAY!!! ❤️❤️❤️❤️" },
  { text: "This is your special day and I am so happy to share this adventure with you." },
  { text: "A year of getting to know you… and there are many more years to know you even better as a friend." },
  { text: "Also, I’m sorry for being annoying sometimes. But it’s your birthday, so forgive me! Haha." },
  { text: "I forgive you too. Hahaha! Have a wonderful 28th year… actually, this is the start of your 29th year, but…" },
  { text: "My point is, I wish you good health, success in your business, and lots of happiness. Keep growing, Snordax!" },
  { text: "Why don't we open the letter? I’m so excited!" },
  { 
    event: "openModal",
    modal: {
      title: "Happy Birthday, YONGSKIIIIIEEEEEEEEE🥰!!!!",
      video: "snordax-house/letter.mp4",
      loop: true,
      closeAfterFirstPlay: true
    }
  },
  { text: "I hope you enjoyed your birthday gift." },
  { text: "You can tell me anything, haha. What's your wish? Hmmm… wait, let's eat first!" },
  { text: "Cheers to more adventures!" },
  {
    event: "completeTheMission",
    missionIndex: 4
  }
];


// ----------------- Dialogue Handling -----------------
// ----------------- Init -----------------
let currentDialogue = [];
let dialogueIndex = 0;
const path = window.location.pathname;  // ✅ store path once
let currentArea = "";                   // ✅ track area name

function getCurrentDialogue() {
  if (path.includes("bakery")) { currentArea = "bakery"; return bakeryDialogue; }
  if (path.includes("store")) { currentArea = "store"; return storeDialogue; }
  if (path.includes("post-office")) { currentArea = "post-office"; return postOfficeDialogue; }
  if (path.includes("snordax-house")) { currentArea = "snordax-house"; return birthdayDialogue; }
  return [];
}

function showDialogue(index) {
  const line = currentDialogue[index];

  // If line has text
  if (line.text) {
    typeWriter(line.text);
    //dialogueText.textContent = line.text;
  }

  // If line has event
  if (line.event === "openModal") {
    const m = line.modal;
    if (m.video) {
      openModal(m.title, `assets/${m.video}`, "video");
    } else if (m.image) {
      openModal(m.title, `assets/${m.image}`, "image");
    }
  } else if (line.event === "completeTheMission") {
    completeTheMission(line.missionIndex);
    dialogueBox.classList.remove("show");

    if (currentArea === "snordax-house") {
      showBirthdayEnding();
    }

    return;
  }
}

// ----------------- Modal Handling -----------------
function openModal(title, src, type = "video", subtitle = "") {
  if (currentArea === "snordax-house") {
    fadeOutBirthdaySong(); // fade out when modal opens
  }

  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const video = document.getElementById("modal-video");
  const img = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

  // reset modal
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle || "";
  video.style.display = "none";
  img.style.display = "none";
  closeBtn.style.display = "none";

  overlay.style.display = "block";
  modal.style.display = "flex";

  if (type === "video") {
    video.style.display = "block";
    video.src = src;
    video.loop = true;
    video.play();

    // show close button only after first play
    video.onended = () => {
      closeBtn.style.display = "inline-block";
    };

    // fallback in case of loop
    video.addEventListener("play", () => {
      if (!video.dataset.playedOnce) {
        video.dataset.playedOnce = "true";
        setTimeout(() => {
          closeBtn.style.display = "inline-block";
        }, 100);
      }
    });

  } else {
    // === GAME MODE (search candle) ===
    img.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.id = "search-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.cursor = "none"; // hide default pointer
    wrapper.style.width = "100%";
    wrapper.style.textAlign = "center";

    const mainImg = document.createElement("img");
    mainImg.src = src; // candle.jpg
    mainImg.style.maxWidth = "90%";
    mainImg.style.height = "auto";
    mainImg.style.display = "block";
    mainImg.style.margin = "0 auto";

    // === Lens ===
    const lens = document.createElement("div");
    const LENS_W = 200, LENS_H = 200, ZOOM = 2;
    lens.id = "lens";
    lens.style.position = "absolute";
    lens.style.border = "2px solid #fff";
    lens.style.borderRadius = "50%";
    lens.style.width = LENS_W + "px";
    lens.style.height = LENS_H + "px";
    lens.style.overflow = "hidden";
    lens.style.pointerEvents = "none";
    lens.style.display = "none";
    lens.style.boxShadow = "0 0 10px rgba(0,0,0,0.6)";

    // canvas inside lens for zoom
    const lensCanvas = document.createElement("canvas");
    lensCanvas.width = LENS_W;
    lensCanvas.height = LENS_H;
    lensCanvas.style.display = "block";
    const lensCtx = lensCanvas.getContext("2d");

    lens.appendChild(lensCanvas);
    wrapper.appendChild(mainImg);
    wrapper.appendChild(lens);

    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = "";
    modalContent.appendChild(wrapper);

    // === Load color map ===
    const colorImg = new Image();
    colorImg.src = src.replace("candle.jpg", "candle-col.png"); 
    const hiddenCanvas = document.createElement("canvas");
    const hiddenCtx = hiddenCanvas.getContext("2d");
    let colorReady = false;
    colorImg.onload = () => {
      hiddenCanvas.width = colorImg.width;
      hiddenCanvas.height = colorImg.height;
      hiddenCtx.drawImage(colorImg, 0, 0);
      colorReady = true;
      //console.log("color map loaded:", colorImg.width, colorImg.height);
    };

    // === Audio ===
    const correctSfx = new Audio("assets/store/correct.mp3");
    const wrongSfx   = new Audio("assets/store/wrong.mp3");
    const tenseSfx   = new Audio("assets/store/tense.mp3");

    tenseSfx.loop = true;
    tenseSfx.volume = 0.6;
    tenseSfx.play().catch(e => console.log("Autoplay blocked:", e));

    // === Lens movement ===
    wrapper.addEventListener("mousemove", (e) => {
      const imgRect = mainImg.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const x_disp = e.clientX - imgRect.left;
      const y_disp = e.clientY - imgRect.top;

      if (x_disp < 0 || y_disp < 0 || x_disp > imgRect.width || y_disp > imgRect.height) {
        lens.style.display = "none";
        return;
      }

      const wrapperX = e.clientX - wrapperRect.left;
      const wrapperY = e.clientY - wrapperRect.top;

      lens.style.display = "block";
      lens.style.left = (wrapperX - LENS_W / 2) + "px";
      lens.style.top  = (wrapperY - LENS_H / 2) + "px";

      const scaleX = mainImg.naturalWidth / imgRect.width;
      const scaleY = mainImg.naturalHeight / imgRect.height;

      const srcW_nat = (LENS_W / ZOOM) * scaleX;
      const srcH_nat = (LENS_H / ZOOM) * scaleY;
      let srcX_nat = x_disp * scaleX - srcW_nat / 2;
      let srcY_nat = y_disp * scaleY - srcH_nat / 2;

      srcX_nat = Math.max(0, Math.min(srcX_nat, mainImg.naturalWidth - srcW_nat));
      srcY_nat = Math.max(0, Math.min(srcY_nat, mainImg.naturalHeight - srcH_nat));

      lensCtx.clearRect(0, 0, LENS_W, LENS_H);
      lensCtx.drawImage(mainImg, srcX_nat, srcY_nat, srcW_nat, srcH_nat, 0, 0, LENS_W, LENS_H);
    });

    wrapper.addEventListener("mouseleave", () => {
      lens.style.display = "none";
    });

    // === Click detection ===
    wrapper.addEventListener("click", (e) => {
      if (!colorReady) return;
      const imgRect = mainImg.getBoundingClientRect();
      const clickX_disp = e.clientX - imgRect.left;
      const clickY_disp = e.clientY - imgRect.top;
      if (clickX_disp < 0 || clickY_disp < 0 || clickX_disp > imgRect.width || clickY_disp > imgRect.height) return;

      const scaleX = colorImg.width / imgRect.width;
      const scaleY = colorImg.height / imgRect.height;
      const clickX_nat = Math.floor(clickX_disp * scaleX);
      const clickY_nat = Math.floor(clickY_disp * scaleY);

      const pixel = hiddenCtx.getImageData(clickX_nat, clickY_nat, 1, 1).data;
      const r = pixel[0], g = pixel[1], b = pixel[2];

      const isCandle = Math.abs(r - 255) < 10 && Math.abs(g - 242) < 10 && Math.abs(b - 0) < 10;

      if (isCandle) {
        correctSfx.play();
        tenseSfx.pause();
        lens.style.boxShadow = "0 0 20px rgba(0,255,0,0.9)";
        setTimeout(() => {
          closeBtn.style.display = "inline-block";
        }, 100);
       
        launchConfetti();

      } else {
        wrongSfx.play();
        lens.style.boxShadow = "0 0 20px rgba(255,0,0,0.9)";
        setTimeout(() => {
          lens.style.boxShadow = "0 0 10px rgba(0,0,0,0.6)";
        }, 700);
      }
    });
  }
}

// === 🎊 Confetti function ===
function launchConfetti() {
  let confettiCanvas = document.getElementById("confetti-canvas");
  if (!confettiCanvas) {
    confettiCanvas = document.createElement("canvas");
    confettiCanvas.id = "confetti-canvas";
    confettiCanvas.style.position = "fixed";
    confettiCanvas.style.top = 0;
    confettiCanvas.style.left = 0;
    confettiCanvas.style.width = "100%";
    confettiCanvas.style.height = "100%";
    confettiCanvas.style.pointerEvents = "none";
    confettiCanvas.style.zIndex = "9999"; // 🚀 put confetti on top of everything
    document.body.appendChild(confettiCanvas);
  }
  
  const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });
  const duration = 8000;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    myConfetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Close modal & go to next dialogue
document.getElementById("modal-close").addEventListener("click", () => {
  if (currentArea === "snordax-house") {
    fadeInBirthdaySong(); // fade back in when modal closes
  }

  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modal-overlay");
  const video = document.getElementById("modal-video");
  const closeBtn = document.getElementById("modal-close");

  modal.style.display = "none";
  overlay.style.display = "none";

  // stop video if active
  if (video) {
    try { video.pause(); } catch(e){}
    video.src = "";
  }

  closeBtn.style.display = "none";

  // advance dialogue after modal closes
  dialogueIndex++;
  showDialogue(dialogueIndex);
});


// ----------------- Event Listeners -----------------
if (backBtn) {
  backBtn.addEventListener("click", () => {
    setHtmlArea("game.html");
    saveGameState();
    window.location.href = "game.html";
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (isTyping) {
      // Skip typing → instantly show full text
      clearInterval(typingInterval);
      isTyping = false;
      const line = currentDialogue[dialogueIndex];
      if (line && line.text) {
        dialogueText.textContent = line.text;
      }
      return;
    }

    dialogueIndex++;

    // Alternate character image depending on area
    if (character && currentArea === "bakery") {
      character.src = (dialogueIndex % 2 === 0)
        ? "assets/bakery/baker-a-clean.png"
        : "assets/bakery/baker-b-clean.png";

    } else if (character && currentArea === "store") {
      character.src = (dialogueIndex % 2 === 0)
        ? "assets/store/store-owner-a-clean.png"
        : "assets/store/store-owner-b-clean.png";

    } else if (character && currentArea === "post-office") {
      character.src = (dialogueIndex % 2 === 0)
        ? "assets/post-office/mail-man-a-clean.png"
        : "assets/post-office/mail-man-b-clean.png";
    } else if (character && currentArea === "snordax-house") {
      character.src = (dialogueIndex % 2 === 0)
        ? "assets/snordax-house/jigglyap-a-clean.png"
        : "assets/snordax-house/jigglyap-b-clean.png";
    }

    showDialogue(dialogueIndex);
  });
}

// ----------------- Init -----------------
document.addEventListener("DOMContentLoaded", () => {
  currentDialogue = getCurrentDialogue();

  if (currentDialogue.length > 0) {
    dialogueBox.classList.add("show");
    showDialogue(0);
  }

  // ✅ Start birthday music only if we’re in Snordax's house
  if (currentArea === "snordax-house") {
    playBirthdaySong();
  }
});

// ----------------- Typing Effect -----------------
let typingInterval = null;
let isTyping = false;
const audio = new Audio("assets/audio/talking-sound.mp3");
audio.loop = true; // ✅ make the sound loop

export function typeWriter(text, callback) {
  let i = 0;
  dialogueText.textContent = "";
  isTyping = true;

  // Stop any ongoing typing
  if (typingInterval) clearInterval(typingInterval);

  // Start looping sound
  audio.currentTime = 0;
  audio.play();

  typingInterval = setInterval(() => {
    if (i < text.length) {
      dialogueText.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      isTyping = false;

      // Stop looping sound once typing ends
      audio.pause();
      audio.currentTime = 0;

      if (callback) callback();
    }
  }, 40); // speed (ms per character)
}

// ----------------- Birthday Background Song -----------------
let birthdayMusic = null;

function playBirthdaySong() {
  if (!birthdayMusic) {
    birthdayMusic = new Audio("assets/snordax-house/birthday-song.mp3");
    birthdayMusic.loop = true;
    birthdayMusic.volume = 1;
  }
  birthdayMusic.play().catch(err => console.log("Autoplay blocked:", err));
}

function fadeOutBirthdaySong(duration = 1000) {
  if (!birthdayMusic) return;
  let step = birthdayMusic.volume / (duration / 100);
  let fade = setInterval(() => {
    if (birthdayMusic.volume > 0.05) {
      birthdayMusic.volume -= step;
    } else {
      clearInterval(fade);
      birthdayMusic.pause();
    }
  }, 100);
}

function fadeInBirthdaySong(duration = 1000) {
  if (!birthdayMusic) return;
  birthdayMusic.play();
  let step = 1 / (duration / 100);
  birthdayMusic.volume = 0;
  let fade = setInterval(() => {
    if (birthdayMusic.volume < 0.95) {
      birthdayMusic.volume += step;
    } else {
      birthdayMusic.volume = 1;
      clearInterval(fade);
    }
  }, 100);
}

function showBirthdayEnding() {
  // === Cake ===
  let cake = document.getElementById("birthday-cake");
  if (!cake) {
    cake = document.createElement("img");
    cake.id = "birthday-cake";
    cake.src = "assets/snordax-house/birthday-cake-a-clean.png";
    cake.style.position = "fixed";
    cake.style.left = "50%";
    cake.style.top = "50%";
    cake.style.transform = "translate(-50%, -50%)";
    cake.style.zIndex = "9998";
    cake.style.width = "300px";
    document.body.appendChild(cake);
  }

  // Animate cake a/b
  let toggle = true;
  setInterval(() => {
    cake.src = toggle
      ? "assets/snordax-house/birthday-cake-a-clean.png"
      : "assets/snordax-house/birthday-cake-b-clean.png";
    toggle = !toggle;
  }, 500);

  // === Confetti Loop ===
  let confettiCanvas = document.getElementById("confetti-canvas");
  if (!confettiCanvas) {
    confettiCanvas = document.createElement("canvas");
    confettiCanvas.id = "confetti-canvas";
    confettiCanvas.style.position = "fixed";
    confettiCanvas.style.top = 0;
    confettiCanvas.style.left = 0;
    confettiCanvas.style.width = "100%";
    confettiCanvas.style.height = "100%";
    confettiCanvas.style.pointerEvents = "none";
    confettiCanvas.style.zIndex = "9999";
    document.body.appendChild(confettiCanvas);
  }

  const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });

  function confettiLoop() {
    myConfetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    myConfetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    requestAnimationFrame(confettiLoop);
  }
  confettiLoop();

  // === Balloons ===
  const balloonColors = ["red", "blue", "yellow", "green", "purple", "orange"];
  function createBalloon() {
  const balloon = document.createElement("div");
  const size = Math.random() * 30 + 30; // 30-60px
  const stringLength = Math.random() * 80 + 50; // random string length 50-130px

  // Balloon styling
  balloon.style.width = size + "px";
  balloon.style.height = size * 1.2 + "px";
  balloon.style.borderRadius = "50%";
  balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.border = "5px solid black"; // black border
  balloon.style.position = "fixed";
  balloon.style.left = Math.random() * window.innerWidth + "px";
  balloon.style.bottom = "-" + (size + stringLength) + "px"; // start below screen
  balloon.style.zIndex = "9997";
  balloon.style.opacity = 0.8;

  // Create string
  const string = document.createElement("div");
  string.style.width = "2px";
  string.style.height = stringLength + "px";
  string.style.backgroundColor = "black";
  string.style.position = "absolute";
  string.style.left = (size / 2 - 1) + "px"; // center under balloon
  string.style.top = size * 1.2 + "px"; // start at bottom of balloon
  balloon.appendChild(string);

  document.body.appendChild(balloon);

  const duration = 10000; // 10s
  const startBottom = - (size + stringLength);
  const endBottom = window.innerHeight + size + stringLength; // above screen

  let start = null;
  const swayAmplitude = Math.random() * 15 + 5; // pixels
  const swaySpeed = Math.random() * 0.002 + 0.001; // speed factor

  function float(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;

    if (progress < 1) {
      const currentBottom = startBottom + progress * (endBottom - startBottom);
      balloon.style.bottom = currentBottom + "px";

      // sway motion
      const sway = Math.sin((timestamp - start) * swaySpeed) * swayAmplitude;
      balloon.style.transform = `translateX(${sway}px)`;

      requestAnimationFrame(float);
    } else {
      balloon.remove();
      createBalloon(); // loop
    }
  }
  requestAnimationFrame(float);
}


  // Start multiple balloons
  for (let i = 0; i < 5; i++) {
    setTimeout(createBalloon, i * 1000); // stagger start
  }
}

export function completeTheMission(missionIndex) {
  if (!gameMissionsCompletionStatus[missionIndex]) return;

  // Mark mission as complete
  gameMissionsCompletionStatus[missionIndex].complete = true;

  // Move to the next mission if not already at the last
  // if (missionIndex === currentMissionIndex) {
  //   advanceMission();
  // }

  // Save updated game state
  saveGameState();
}
