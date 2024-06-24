import "./style.css";

import Camera from "./Classes/Camera";
import GameManager from "./Classes/GameManager";
import { Player } from "./Classes/Player";
import { drawStartScreen } from "./Screens/StartScreen";
import { Canvas, cameraPosition } from "./constants/Canvas";
import { bigDragon } from "./constants/EnemyLocation";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants/Sprite";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;
let backDx = 1;
let rows = Canvas.ROWS;
let cols = Canvas.COLS;
canvas.width = rows * TILE_WIDTH;
canvas.height = cols * TILE_HEIGHT;
canvas.style.border = "1px solid red";

const player = new Player(cameraPosition);
const camera: Camera = new Camera();

window.onload = () => {
  drawStartScreen(ctx);
};

function drawStat() {
  ctx.font = "10px Shovel";
  ctx.fillStyle = "white";
  ctx.fillText(`Health: ${player.health}`, 10, 10);

  ctx.font = "10px Shovel";
  ctx.fillStyle = "white";
  ctx.fillText(`Enemy Health: ${bigDragon.health}`, 10, 25);
}

const gameManager = new GameManager(
  {
    player,
    cameraPositionWorld: cameraPosition,
  },
  ctx
);

let lastTime = 0;
const FPS = 60;
const FRAME_DURATION = 1000 / FPS;

function draw(currentTime: number = 0) {
  let deltaTime = currentTime - lastTime;
  if (deltaTime >= FRAME_DURATION) {
    lastTime = currentTime - (deltaTime % FRAME_DURATION);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleKeyInputs();
    gameManager.update(ctx);
    camera.update(player.position);
    drawStat();
  }
  requestAnimationFrame(draw);
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

// TODO: Remove this
const printPlayerPosition = document.createElement("button");
printPlayerPosition.innerText = "Print Player Position";
printPlayerPosition.style.position = "absolute";
printPlayerPosition.style.top = "0";
printPlayerPosition.style.right = "0";
printPlayerPosition.onclick = () => {
  console.log(player.position);
};
document.body.appendChild(printPlayerPosition);

document.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    draw();
  }
});

const changeLevel = document.createElement("button");
changeLevel.innerText = "Change Level";
changeLevel.style.position = "absolute";
changeLevel.style.top = "0";
changeLevel.style.left = "0";
changeLevel.onclick = () => {
  gameManager.currentLevel++;
};
document.body.appendChild(changeLevel);
