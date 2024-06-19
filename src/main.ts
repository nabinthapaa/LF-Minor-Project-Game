import "./style.css";

import { Player } from "./Classes/Player";
import { Canvas } from "./constants/Canvas";
import { gameSprite, tileset } from "./images/preLoad";
import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants/Sprite";
import { DrawMap } from "./map/level1";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

ctx.canvas.width = Canvas.CANVAS_WIDTH;
ctx.canvas.height = Canvas.CANVAS_HEIGHT;

const keySet = new Set();
const player = new Player();

window.onload = () => {
  // Fixing the canvas scaling issue
  draw();
};

function drawBackground() {
  ctx.drawImage(gameSprite.background, 0, 0, Canvas.CANVAS_WIDTH, Canvas.CANVAS_HEIGHT);
}

let lastTime = 0;
const FPS = 60;
const FRAME_DURATION = 1000 / FPS;

function draw(currentTime: number = 0) {
  let deltaTime = currentTime - lastTime;
  if (deltaTime >= FRAME_DURATION) {
    lastTime = currentTime - (deltaTime % FRAME_DURATION);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    DrawMap(ctx);
    updatePlayerLocation();
    player.applyGravity();
    player.drawPlayer(ctx);
  }
  requestAnimationFrame(draw);
}

function updatePlayerLocation() {
  if (keySet.has("ArrowRight") || keySet.has("KeyH")) {
    player.moveRight();
  } else if (keySet.has("ArrowLeft") || keySet.has("KeyL")) {
    player.moveLeft();
  } else if (keySet.has("Space")) {
    player.jump();
  } else if (keySet.has("KeyS")) {
    player.attackNormal();
  } else {
    player.resetSprite();
  }
}

document.addEventListener("keydown", (e) => {
  keySet.add(e.code);
});

document.addEventListener("keyup", (e) => {
  keySet.delete(e.code);
});

//@ts-ignore
document.addEventListener("mousedown", (e) => {
  player.jumpAttack();
});
