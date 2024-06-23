import "./style.css";

import Camera from "./Classes/Camera";
import GameManager from "./Classes/GameManager";
import { Obstacle } from "./Classes/Obstacle";
import { Player } from "./Classes/Player";
import { Beeto } from "./Classes/enemies/Beeto";
import BigDragon from "./Classes/enemies/BigDragon";
import { Enemy } from "./Classes/enemies/Enemy";
import { Canvas } from "./constants/Canvas";
import { bigDirtBlockPostionLvl1 as bigDirtBlockPostion } from "./constants/ObstaclePosition";
import { obstacleSprite } from "./constants/ObstacleSprite";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants/Sprite";
import { Mapdata, getCollisionMap, makePlatforms } from "./map/level1";
import { Position } from "./types/Position";
import { drawStartScreen } from "./Screens/StartScreen";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;
let backDx = 1;
let rows = Canvas.ROWS;
let cols = Canvas.COLS;
canvas.width = rows * TILE_WIDTH;
canvas.height = cols * TILE_HEIGHT;
canvas.style.border = "1px solid red";

const columnDifference = cols - Mapdata.length;
for (let i = 0; i < columnDifference; i++) {
  Mapdata.unshift(new Array(rows).fill(403));
}
const floorCollisions = getCollisionMap(Mapdata);
const platforms = makePlatforms(floorCollisions);

const cameraPosition: Position = {
  x: 0,
  y: 0,
};

const keySet = new Set();
const player = new Player(platforms, cameraPosition);

window.onload = () => {
  drawStartScreen(ctx);
};

// TODO: Refactor this to use a game manager class
const enemy: Enemy = new Beeto(cameraPosition, { x: 600, y: 25 * 16 - 64 });
const bigDragon: BigDragon = new BigDragon(cameraPosition, { x: 183, y: 270 });
const obstacles: Obstacle[] = [];

for (let i = 0; i < bigDirtBlockPostion.length; i++) {
  let position: Position = {
    x: bigDirtBlockPostion[i].x,
    y: bigDirtBlockPostion[i].y + columnDifference * TILE_HEIGHT,
  };
  obstacles.push(new Obstacle(position, obstacleSprite["bigDirtBlock"]));
}

const camera: Camera = new Camera();

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
    platforms,
    player,
    enemies: [enemy, bigDragon],
    cameraPositionWorld: cameraPosition,
    obstacles,
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
    gameManager.update(ctx, Mapdata);
    camera.update(player.position);
    drawStat();
  }
  requestAnimationFrame(draw);
}

function handleKeyInputs() {
  if (gameManager.keySet.has("ArrowRight") || keySet.has("KeyL")) {
    player.moveRight();
    if (camera.shouldPanCameraLeft(ctx, cameraPosition)) {
      cameraPosition.x -= player.velocity.x;
      canvas.parentElement?.setAttribute("style", `--move-left: ${backDx--}px`);
    }
  } else if (gameManager.keySet.has("ArrowLeft") || keySet.has("KeyH")) {
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
