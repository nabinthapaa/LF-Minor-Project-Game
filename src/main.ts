import "./style.css";

import Camera from "./Classes/Camera";
import GameManager from "./Classes/GameManager";
import Player from "./Classes/Player";
import { drawStartScreen } from "./Screens/StartScreen";
import { Canvas, cameraPosition } from "./constants/Canvas";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants/Sprite";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const infoCanvas = document.querySelector<HTMLCanvasElement>("#status")!;
const ctx = canvas.getContext("2d")!;
const infoCanvasCtx = infoCanvas.getContext("2d")!;
/**
 * Variables use for change the background image from
 * left to right or vice-versa
 */
let backDx = 1;
let rows = Canvas.ROWS;
let cols = Canvas.COLS;
canvas.width = rows * TILE_WIDTH;
canvas.height = cols * TILE_HEIGHT;
infoCanvas.width = canvas.width;
infoCanvas.height = 50;
infoCanvas.style.display = "none";

const player = new Player(cameraPosition);
const camera: Camera = new Camera();
let animationId: number = 0;

window.onload = () => {
  draw();
};

function drawStat() {
  infoCanvasCtx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
  infoCanvasCtx.fillStyle = "#000";
  infoCanvasCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);
  infoCanvasCtx.font = "10px Shovel";
  infoCanvasCtx.fillStyle = "purple";
  infoCanvasCtx.fillText(`Health`, 20, 15);
  infoCanvasCtx.font = "15px Shovel";
  infoCanvasCtx.fillText(`${player.health}`, 20, 35);

  infoCanvasCtx.font = "10px Shovel";
  infoCanvasCtx.fillStyle = "gold";
  infoCanvasCtx.fillText(`Gold`, 150, 15);
  infoCanvasCtx.font = "15px Shovel";
  infoCanvasCtx.fillText(`${player.gold}`, 150, 35);

  infoCanvasCtx.font = "10px Shovel";
  infoCanvasCtx.fillStyle = "red";
  infoCanvasCtx.fillText(`Current Level`, 250, 15);
  infoCanvasCtx.font = "15px Shovel";
  infoCanvasCtx.fillText(`${gameManager.currentLevel}`, 250, 35);
}

const gameManager = new GameManager(
  {
    player,
    cameraPositionWorld: cameraPosition,
  },
  ctx
);

const gameState = {
  isGameStart: false,
  isPlaying: false,
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
};

let lastTime = 0;
const FPS = 60;
const FRAME_DURATION = 1000 / FPS;

function draw(currentTime: number = 0) {
  if (gameState.isPlaying && !gameState.isGamePaused) {
    let deltaTime = currentTime - lastTime;
    if (deltaTime >= FRAME_DURATION) {
      lastTime = currentTime - (deltaTime % FRAME_DURATION);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleKeyInputs();
      gameManager.update(ctx);
      camera.update(player.position);
      drawStat();
    }
    if (gameManager.currentLevel > gameManager.maxLevel) {
      gameState.isPlaying = false;
      gameState.isGameWon = true;
    }
  }
  if (gameState.isGameWon) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Shovel";
    ctx.fillStyle = "white";
    ctx.fillText(
      "You Have Cleared the game ",
      canvas.width / 3,
      canvas.height / 3
    );
    ctx.fillText(
      "Press R to restart",
      canvas.width / 3,
      canvas.height / 3 + 25
    );
  }
  if (!gameState.isGameStart) {
    drawStartScreen(ctx);
  }
  animationId = requestAnimationFrame(draw);
}

function handleKeyInputs() {
  if (gameManager.keySet.has("ArrowRight") || gameManager.keySet.has("KeyL")) {
    player.moveRight();
    if (camera.shouldPanCameraLeft(ctx, cameraPosition)) {
      cameraPosition.x -= player.velocity.x;
      canvas.parentElement?.setAttribute("style", `--move-left: ${backDx--}px`);
    }
  } else if (
    gameManager.keySet.has("ArrowLeft") ||
    gameManager.keySet.has("KeyH")
  ) {
    player.moveLeft();
    if (camera.shouldPanCameraRight(ctx, cameraPosition)) {
      cameraPosition.x -= player.velocity.x;
      canvas.parentElement?.setAttribute("style", `--move-left: ${backDx++}px`);
    }
  } else if (gameManager.keySet.has("Space")) {
    player.jump();
  } else if (
    gameManager.keySet.has("ArrowDown") &&
    !gameManager.player.isGrounded
  ) {
    player.jumpAttack();
  } else if (gameManager.keySet.has("KeyS")) {
    player.attackNormal();
  } else {
    player.resetSprite();
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight" ||
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "ArrowDown"
  )
    e.preventDefault();
  gameManager.keySet.add(e.code);
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  gameManager.keySet.delete(e.code);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    gameState.isGameStart = true;
    infoCanvas.style.display = "block";
    if (gameState.isGameStart) {
      gameState.isPlaying = true;
    }
  }
  if (e.code === "KeyP") {
    if (gameState.isGameOver || gameState.isGameWon || !gameState.isGameStart)
      return;
    gameState.isGamePaused = !gameState.isGamePaused;
    gameState.isPlaying = !gameState.isPlaying;
    if (animationId) {
      ctx.font = "20px Shovel";
      ctx.fillStyle = "red";
      ctx.fillText(
        "Game Paused",
        canvas.width / 2 - 110,
        canvas.height / 2 + 55
      );
      cancelAnimationFrame(animationId);
      animationId = 0;
    } else {
      draw();
    }
  }
  if (e.code === "KeyR") {
    if (gameState.isGameWon) {
      gameState.isGameStart = false;
      gameState.isPlaying = true;
      gameState.isGameWon = false;
      gameState.isGameOver = false;
      gameState.isGamePaused = false;
      gameManager.init();
    }
  }
});
