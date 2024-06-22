import "./style.css";

import { Player } from "./Classes/Player";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants/Sprite";
import { gameSprite } from "./images/preLoad";

import { Enemy } from "./Classes/Enemy";
import { drawMap, platforms } from "./map/level1";
import { Position } from "./types/Position";
import Camera from "./Classes/Camera";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;
let backDx = 1;

const rows = 50;
const cols = 25;

canvas.width = rows * TILE_WIDTH;
canvas.height = cols * TILE_HEIGHT;

const cameraPosition: Position = {
  x: 0,
  y: 0,
};

const keySet = new Set();
const player = new Player(platforms, cameraPosition);

window.onload = () => {
  draw();
};

const enemy: Enemy = new Enemy(cameraPosition, { x: 600, y: 25 * 16 - 64 });
const camera: Camera = new Camera();

function drawStat() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`Health: ${player.health}`, 10, 50);

  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`EnemyHealth: ${enemy.health}`, 10, 100);
}

let lastTime = 0;
const FPS = 60;
const FRAME_DURATION = 1000 / FPS;

function draw(currentTime: number = 0) {
  let deltaTime = currentTime - lastTime;
  if (deltaTime >= FRAME_DURATION) {
    lastTime = currentTime - (deltaTime % FRAME_DURATION);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, cameraPosition);
    updatePlayerLocation();
    player.updatePlayer(ctx);
    if (enemy.isColliding(player.getSolidVersionofPlayer())) {
      console.log("EMEMY COLLIDING");
      if (player.isAttacking) {
        enemy.takeDamage(1);
      } else if (enemy.isAlive() && !player.isAttacking) {
        player.takeDamage(1);
      }
    }
    camera.update(player.position);
    enemy.renderEnemy(ctx);
    enemy.move();
    drawStat();
  }
  requestAnimationFrame(draw);
}

function updatePlayerLocation() {
  if (keySet.has("ArrowRight") || keySet.has("KeyH")) {
    player.moveRight();
    if (camera.shouldPanCameraLeft(ctx, cameraPosition)) {
      cameraPosition.x -= player.velocity.x;
      canvas.parentElement?.setAttribute("style", `--move-left: ${backDx--}px`);
    }
  } else if (keySet.has("ArrowLeft") || keySet.has("KeyL")) {
    player.moveLeft();
    if (camera.shouldPanCameraRight(ctx, cameraPosition)) {
      cameraPosition.x -= player.velocity.x;
      canvas.parentElement?.setAttribute("style", `--move-left: ${backDx++}px`);
    }
  } else if (keySet.has("Space")) {
    player.jump();
  } else if (keySet.has("KeyS")) {
    player.attackNormal();
  } else {
    player.resetSprite();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Space")
    e.preventDefault();
  // console.log(keySet)
  keySet.add(e.code);
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  keySet.delete(e.code);
});

//@ts-ignore
document.addEventListener("mousedown", (e) => {
  player.jumpAttack();
});
