import { saveGameState } from "./script.js";

export let gameMissions = [
  "Find Jigglyap and ask about your key. Jigglyap is hiding in a visually unique place.",
  "Help Jigglyap buy cake in the bakery.",
  "Help Jigglyap buy candle in the store.",
  "Help Jigglyap get the letter in the post office.",
  "Go to your house.",
  "Live a live you're proud of!❤️"
];

export let gameMissionsCompletionStatus = {
  0: {
    complete: false,
    shown: false,
    missionArea: "Jigglyap's Hideout",
    accessibleAreas: ["Jigglyap's Hideout"],
    goal: "Find Jigglyap and ask about your key. Jigglyap is hiding in a visually unique place.",
    completionDialogue: [
      "Great! You found me! Hihi.",
      "Hmm… I'm hungry and I also forgot where your key is.",
      "Why don't you help me get a cake from the bakery?",
      "Maybe I'll remember it once I taste a good cake."
    ],
  },
  1: {
    complete: false,
    shown: false,
    missionArea: "Bakery",
    accessibleAreas: ["Jigglyap's Hideout", "Bakery"],
    goal: "Help Jigglyap get a cake in the bakery.",
    completionDialogue: [
      "The cake looks delicious!",
      "I want to taste it now, but…",
      "Can we go to the store? I’m planning to buy a candle.",
      "Great! Let's goooo!"
    ],
  },
  2: {
    complete: false,
    shown: false,
    missionArea: "Store",
    accessibleAreas: ["Jigglyap's Hideout", "Bakery", "Store"],
    goal: "Help Jigglyap get the candle in the store.",
    completionDialogue: [
      "You have a really good eye!",
      "I like the candle we have… ahem… a legendary one.",
      "Do you want me to light the candle and blow it?",
      "Sure! Can we go to the post office? I have a letter."
    ],
  },
  3: {
    complete: false,
    shown: false,
    missionArea: "Post Office",
    accessibleAreas: ["Jigglyap's Hideout", "Bakery", "Store", "Post Office"],
    goal: "Help Jigglyap get the letter in the post office.",
    completionDialogue: [
      "That mailman was so good-looking! You should come back tomorrow.",
      "Are you planning to send a package or a letter? Hahaha!",
      "OMG! I remember where your key is now…",
      "I actually have it! Let's go to your place."
    ],
  },
  4: {
    complete: false,
    shown: false,
    missionArea: "Snordax's House",
    accessibleAreas: ["Jigglyap's Hideout", "Bakery", "Store", "Post Office", "Snordax's House"],
    goal: "Go to your house.",
    completionDialogue: [
      "Thanks for accompanying me!",
      "Enjoy your day, Snordax. Uhmm…",
      "I have to go now. Happy birthday!",
      "Make sure to smile and create more adventures, okay? Hmm… can I join? Haha."
    ],
  },
  5: {
    complete: false,
    shown: false,
    missionArea: "",
    accessibleAreas: ["Jigglyap's Hideout", "Bakery", "Store", "Post Office", "Snordax's House"],
    goal: "Live a life you're proud of!❤️",
    completionDialogue: [],
  },
}

export const missionRequirements = {
  0: ["Jigglyap's Hideout"],        // Only hideout is accessible
  1: ["Bakery"],                  // Mission 1: go to bakery
  2: ["Store"],                   // Mission 2: go to store
  3: ["Post Office"],             // Mission 3: go to post-office
  4: ["Snordax's House"]          // Mission 4: go to Snordax's House
};

export const accessibleAreasByMission = {
  0: ["Jigglyap's Hideout"],
  1: ["Jigglyap's Hideout", "Bakery"],
  2: ["Jigglyap's Hideout", "Bakery", "Store"],
  3: ["Jigglyap's Hideout", "Bakery", "Store", "Post Office"],
  4: ["Jigglyap's Hideout", "Bakery", "Store", "Post Office", "Snordax's House"]
};

export let currentMissionIndex = 0;

export function setCurrentMissionIndex(index) {
  currentMissionIndex = index;
}


export function getCurrentMission() {
  return gameMissions[currentMissionIndex];
}

export let completedMissions = [];

export function advanceMission() {
  if (currentMissionIndex < gameMissions.length - 1) {
    completedMissions.push(currentMissionIndex); 
    currentMissionIndex++;
  }
}

// Add at the top or wherever appropriate
export const jigglyap = {
  x: 0,
  y: 0,
  visible: false,
  offsetX: -50, // behind Snorlax by default
  offsetY: 0,
  speed: 2,
  frameIndex: 0,
  frameTick: 0,
  facingRight: true,
  mode: "front", // front, back, side
  frames: {
    side: [],
    front: [],
    back: [],
    sing: [],
    angry: [],
  },
  currentImage: null,
  singImages: [],
  angryImages: [],
  singAudio: new Audio("assets/audio/jp-singing.mp3"),
  angryAudio: new Audio("assets/audio/jp-angry.mp3")
};


// Load Jigglyap frames
export function loadJigglyapFrames() {
  const sideFiles = ["jp-a-clean.png","jp-b-clean.png","jp-c-clean.png","jp-d-clean.png","jp-e-clean.png"];
  const frontFiles = ["jp-front-a-clean.png","jp-front-b-clean.png","jp-front-c-clean.png","jp-front-d-clean.png","jp-front-e-clean.png"];
  const backFiles = ["jp-back-a-clean.png","jp-back-b-clean.png","jp-back-c-clean.png","jp-back-d-clean.png","jp-back-e-clean.png"];

  sideFiles.forEach(file => {
    const img = new Image();
    img.src = `assets/jp/${file}`;
    jigglyap.frames.side.push(img);
  });
  frontFiles.forEach(file => {
    const img = new Image();
    img.src = `assets/jp/${file}`;
    jigglyap.frames.front.push(img);
  });
  backFiles.forEach(file => {
    const img = new Image();
    img.src = `assets/jp/${file}`;
    jigglyap.frames.back.push(img);
  });

   // Angry frames
  ["jp-angry-a-clean.png","jp-angry-b-clean.png"].forEach(file => {
    const img = new Image();
    img.src = `assets/jp/${file}`;
    jigglyap.frames.angry.push(img);
  });

  // Singing frames
  ["jp-sing-a-clean.png","jp-sing-b-clean.png"].forEach(file => {
    const img = new Image();
    img.src = `assets/jp/${file}`;
    jigglyap.frames.sing.push(img);
  });
}

// Call immediately
loadJigglyapFrames();

// Distance to keep from Snorlax
const FOLLOW_DISTANCE = 120; 

export function updateJigglyap(player, keys) {
  if(!jigglyap.visible) return;
  const moving = keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"] ||
                 keys["w"] || keys["a"] || keys["s"] || keys["d"];

  let targetX = jigglyap.x;
  let targetY = jigglyap.y;

  // Determine target position based on Snorlax direction
  if (moving) {
    if (keys["ArrowLeft"] || keys["a"]) {
      targetX = player.x + FOLLOW_DISTANCE; // right side
      targetY = player.y;
      jigglyap.mode = "side";
      jigglyap.facingRight = true; // facing left
      jigglyap.defaultFrame = jigglyap.frames.side[0]; 
    }
    else if (keys["ArrowRight"] || keys["d"]) {
      targetX = player.x - FOLLOW_DISTANCE; // left side
      targetY = player.y;
      jigglyap.mode = "side";
      jigglyap.facingRight = false; // flipped
      jigglyap.defaultFrame = jigglyap.frames.side[0]; 
    }
    else if (keys["ArrowUp"] || keys["w"]) {
      targetX = player.x;
      targetY = player.y + FOLLOW_DISTANCE; // below Snorlax
      jigglyap.mode = "back";
      jigglyap.facingRight = true;
      jigglyap.defaultFrame = jigglyap.frames.back[0]; 
    }
    else if (keys["ArrowDown"] || keys["s"]) {
      targetX = player.x;
      targetY = player.y - FOLLOW_DISTANCE; // above Snorlax
      jigglyap.mode = "front";
      jigglyap.facingRight = true;
      jigglyap.defaultFrame = jigglyap.frames.front[0]; 
    }

    // Smoothly move Jigglyap towards target
    const dx = targetX - jigglyap.x;
    const dy = targetY - jigglyap.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      jigglyap.x += (dx / dist) * jigglyap.speed;
      jigglyap.y += (dy / dist) * jigglyap.speed;
    }

    // Animate frames
    jigglyap.frameTick = (jigglyap.frameTick + 1) % 15;
    if (jigglyap.frameTick === 0) {
      jigglyap.frameIndex = (jigglyap.frameIndex + 1) % 5;
    }
  } else {
    // Player idle -> Jigglyap stays still at last position
    jigglyap.frameIndex = 0;
  }
}

export function drawJigglyap(ctx, camX, camY, keys, nightMode) {
  if(!jigglyap.visible) return;
 // console.log(jigglyap);

  let frame;
  if (jigglyap.mode === "sing") {
    frame = jigglyap.frames.sing[jigglyap.frameIndex];
  } else if (jigglyap.mode === "angry") {
    frame = jigglyap.frames.angry[jigglyap.frameIndex];
  } else if (
    keys["ArrowLeft"] || keys["a"] ||
    keys["ArrowRight"] || keys["d"] ||
    keys["ArrowUp"] || keys["w"] ||
    keys["ArrowDown"] || keys["s"]
  ) {
    // moving -> use animation frame
    if (jigglyap.mode === "side") {
      frame = jigglyap.frames.side[jigglyap.frameIndex];
    } else if (jigglyap.mode === "back") {
      frame = jigglyap.frames.back[jigglyap.frameIndex];
    } else {
      frame = jigglyap.frames.front[jigglyap.frameIndex];
    }
  } else {
    // idle -> default frame
    frame = jigglyap.defaultFrame;
  }

  if (!frame || !frame.complete) return;

  const imgSize = 140;
  ctx.save();
  ctx.translate(jigglyap.x - camX, jigglyap.y - camY);
  if (jigglyap.mode === "side" && !jigglyap.facingRight) {
    ctx.scale(-1, 1);
  }
  if(nightMode) ctx.filter = "brightness(10%)"; 
  ctx.drawImage(frame, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
  ctx.restore();
}

export const jigglyapDialogue = {
  active: false,
  lines: [],
  currentLine: 0,
  displayedText: "",   
  isTyping: false,
  typingIndex: 0,
  typingInterval: null,
  xOffset: 0,
  yOffset: -160
};

const jigglyapAudio = new Audio("../assets/audio/talking-sound.mp3");
jigglyapAudio.loop = true;

export function foundJigglyapDialogue() {
  jigglyapDialogue.lines = [
    "Great! You found me hihi.",
    "Hmmm. I'm hungry and I also forgot where your key is.",
    "Why don't you help me get a cake in the bakery?",
    "Maybe I'll remember it once I taste a good cake."
  ];
  jigglyapDialogue.currentLine = 0;
}

// make sure startJigglyapTypewriter is exported (you already have it exported)
export function advanceJigglyapDialogue() {
  const jd = jigglyapDialogue;

  if (!jd.active) return;

  // If currently typing, finish current line immediately (skip)
  if (jd.isTyping) {
    if (jd.typingInterval) clearInterval(jd.typingInterval);
    jd.isTyping = false;
    // show the full current line instantly
    jd.displayedText = jd.lines[jd.currentLine] || "";
    // stop the looped talking audio
    try {
      jigglyapAudio.pause();
      jigglyapAudio.currentTime = 0;
    } catch (e) { /* ignore audio errors */ }
    return;
  }

  // Otherwise move to next line
  jd.currentLine++;

  if (jd.currentLine < (jd.lines?.length || 0)) {
    // start typing the next line
    startJigglyapTypewriter(jd.lines[jd.currentLine]);
  } else {
    // dialogue finished
    jd.active = false;
    jd.displayedText = "";
    // call onFinish if provided (e.g. completeMission)
    if (typeof jd.onFinish === "function") {
      jd.onFinish();
      // avoid calling it multiple times
      jd.onFinish = null;
    }
  }
}

export function startJigglyapTypewriter(text) {
  const jd = jigglyapDialogue;
  //console.log("Typewriter started:", text);

  // Reset
  if (jd.typingInterval) clearInterval(jd.typingInterval);
  jd.displayedText = "";
  jd.typingIndex = 0;
  jd.isTyping = true;

  // Start sound
  jigglyapAudio.currentTime = 0;
  jigglyapAudio.play();

  jd.typingInterval = setInterval(() => {
    if (jd.typingIndex < text.length) {
      jd.displayedText += text.charAt(jd.typingIndex);
      jd.typingIndex++;
    } else {
      clearInterval(jd.typingInterval);
      jd.isTyping = false;
      jigglyapAudio.pause();
      jigglyapAudio.currentTime = 0;
    }
  }, 40); // typing speed
}

export let displayedRandomMessages = [];

// Random messages
export const jigglyapRandomMessages = [
  "You’re the kind of friend people pray to have.",
  "Forever grateful that God made us friends.",
  "I hope you know how deeply loved and appreciated you are.",
  "Are you WiFi???.... Because I’m feeling such a strong connection with you.",
  "If you were a vegetable, you’d be a cute-cumber.",
  "If you were words on a page, you’d be a fine print",
  "Do you have a map? Because I just keep getting lost in our conversations",
  "If you were a fruit, you’d be a fineapple.",
  "Hey, I know you push yourself so hard, but please remember—you’re already more than enough just as you are.",
  "Even when you feel unseen, I see you. I notice the effort, the heart, and the way you show up for everyone.",
  "Please choose yourself always. You deserve the love you give to others.",
  "Your reliability is one of your most beautiful traits. I hope you know how safe and steady you make others feel.",
  "I admire your drive and competitiveness, but you are amazing for who you are, not what you achieve.",
  "You don’t have to be perfect with me—I value the real, raw, unfiltered you.",
  "Sometimes the quiet heroes don’t realize their impact. You’re one of them.",
  "You’re not just reliable—you’re irreplaceable.",
  "I hope you see yourself the way I do: someone strong, brilliant, and worth celebrating every day.",
  "You don’t have to carry everything alone—I’ve got you, always.",
  "You might feel invisible sometimes, but you’re unforgettable to me.",
  "You don’t always have to hold everything together—I'll listen anytime.",
  "Your light shines brighter than you think, even when you can’t see it yourself.",
  "I see the effort behind everything you do. You’re valued more than words can say.",
  "Yongskiiieeeeeee!!! Snordax!! HAHAHAH",
  "I hope you’re proud of yourself, because I’m proud of you.",
  "If you were a burger at McDonald’s, you’d be the McGorgeous.",
  "If you were a dessert, you’d be an ube. U my bebe HAHAHA.",
  "How big is your....... uhm... heart!",
  "7 inch crust reveal when? HAHAHHA",
  "Libre berger serrr!"
];

export function drawJigglyapDialogue(ctx, camX, camY) {
  if (!jigglyapDialogue.active || !jigglyap.visible) return;

  //const text = jigglyapDialogue.lines[jigglyapDialogue.currentLine];
  const jd = jigglyapDialogue;
  const fullText = jd.lines[jd.currentLine];
  const text = jd.displayedText || "";


  // Position bubble 10px above Jigglyap
  const x = jigglyap.x - camX + jigglyapDialogue.xOffset;
  const y = jigglyap.y - camY - 50; 

  const padding = 16;
  const lineHeight = 20;
  const maxCharsPerLine = 30;
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.textBaseline = "top";

  // Split text into lines
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (let word of words) {
    if ((currentLine + word).length > maxCharsPerLine) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  // Calculate box size
  const textWidths = lines.map(line => ctx.measureText(line).width);
  const boxWidth = Math.max(...textWidths) + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;

  // Draw bubble (rounded rectangle)
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  roundRect(ctx, x - boxWidth / 2, y - boxHeight, boxWidth, boxHeight, 12, true, true);

  // Bubble tail pointing down to Jigglyap
  ctx.beginPath();
  ctx.moveTo(x - 12, y);       // left point
  ctx.lineTo(x + 12, y);       // right point
  ctx.lineTo(x, y + 15);       // bottom point
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  // Draw text
  ctx.fillStyle = "black";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const textX = x - ctx.measureText(line).width / 2;
    const textY = y - boxHeight + padding + i * lineHeight;
    ctx.fillText(line, textX, textY);
  }

  // Draw Next → hint with padding and color
  if (!jd.isTyping) {
    const hintText = "Next →";
    ctx.fillStyle = "#4682b4";
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.fillText(
      hintText,
      x + boxWidth / 2 - padding - ctx.measureText(hintText).width,
      y - boxHeight + boxHeight - padding - 4
    );
  }
}

// Helper for rounded rectangle
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") stroke = true;
  if (typeof radius === "undefined") radius = 5;
  if (typeof radius === "number") {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

