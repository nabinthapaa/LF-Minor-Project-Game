import Platform from "../Classes/Platform";
import { Canvas } from "../constants/Canvas";
import { EPlatform } from "../enums/Platform";
import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";
import mapData from "./mapData.json";

// TODO: Move to constants if works
const collisionLevel1Tiles = new Set([
  356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370,
  372, 373, 374, 379, 380, 381, 384, 385, 386, 387, 388, 389, 390, 391, 392,
  393, 394, 395, 398, 399, 400, 401, 297
]);

let MapData: number[][] = mapData;
let floorCollisions: number[][] = [];

for (let y = 0; y < MapData.length; y++) {
  floorCollisions[y] = [];
  for (let x = 0; x < MapData[y].length; x++) {
    let currentTile = MapData[y][x];
    switch (true) {
      case currentTile === 403:
        floorCollisions[y][x] = EPlatform.PASSTHROUGH;
        break;
      case collisionLevel1Tiles.has(currentTile):
        floorCollisions[y][x] = EPlatform.COLLIDABLE;
        break;
      case currentTile === 354:
        floorCollisions[y][x] = EPlatform.CLIMBABLE;
        break;
      case currentTile === 355:
        floorCollisions[y][x] = EPlatform.CLIMBABLE;
        break;
      default:
        floorCollisions[y][x] = EPlatform.PASSTHROUGH;
    }
  }
}

export const platforms: Platform[] = [];

for (let y = 0; y < floorCollisions.length; y++) {
  for (let x = 0; x < floorCollisions[y].length; x++) {
    if (floorCollisions[y][x] === EPlatform.CLIMBABLE) {
      platforms.push(new Platform(x * 16, y * 16, 16, 16, EPlatform.CLIMBABLE));
    }

    if (floorCollisions[y][x] === EPlatform.COLLIDABLE) {
      if (
        isTopPlatformColidable(x, y) &&
        isBottomPlatformColidable(x, y) &&
        isLeftPlatformColidable(x, y) &&
        isRightPlatformColidable(x, y)
      ) {
        continue;
      } else if (
        isTopPlatformColidable(x, y) &&
        isRightPlatformColidable(x, y) &&
        isLeftPlatformColidable(x, y) &&
        isPlatformOnBottomOfCanvas(y)
      )
        continue;
      else if (
        isTopPlatformColidable(x, y) &&
        isLeftPlatformColidable(x, y) &&
        isBottomPlatformColidable(x, y)
      ) {
        platforms.push(
          new Platform(x * 16, y * 16, 16, 16, EPlatform.COLLIDABLE, true)
        );
        continue;
      } else if (
        isTopPlatformColidable(x, y) &&
        isRightPlatformColidable(x, y) &&
        isBottomPlatformColidable(x, y)
      ) {
        platforms.push(
          new Platform(x * 16, y * 16, 16, 16, EPlatform.COLLIDABLE, true)
        );
        continue;
      }
      platforms.push(
        new Platform(x * 16, y * 16, 16, 16, EPlatform.COLLIDABLE)
      );
    }
  }
}

function isTopPlatformColidable(x: number, y: number) {
  if (
    x < 0 ||
    y < 0 ||
    y >= floorCollisions.length ||
    x >= floorCollisions[y].length
  ) {
    return false;
  }
  if (y - 1 < 0) return false;
  return floorCollisions[y - 1][x] === EPlatform.COLLIDABLE;
}

function isBottomPlatformColidable(x: number, y: number) {
  if (
    x < 0 ||
    y < 0 ||
    y >= floorCollisions.length ||
    x >= floorCollisions[y].length
  ) {
    return false;
  }
  if (y + 1 >= floorCollisions.length) return false;
  return (
    floorCollisions[y + 1][x] === EPlatform.COLLIDABLE ||
    y * 16 >= Canvas.CANVAS_HEIGHT - 16
  );
}

function isLeftPlatformColidable(x: number, y: number) {
  if (
    x < 0 ||
    y < 0 ||
    y >= floorCollisions.length ||
    x >= floorCollisions[y].length
  ) {
    return false;
  }
  return floorCollisions[y][x - 1] === EPlatform.COLLIDABLE;
}

function isRightPlatformColidable(x: number, y: number) {
  if (
    x < 0 ||
    y < 0 ||
    y >= floorCollisions.length ||
    x >= floorCollisions[y].length
  ) {
    return false;
  }
  if (x + 1 >= floorCollisions[y].length) return false;
  return floorCollisions[y][x + 1] === EPlatform.COLLIDABLE;
}

function isPlatformOnBottomOfCanvas(y: number) {
  return y * 16 + 16 >= Canvas.CANVAS_HEIGHT;
}

export function drawMap(ctx: CanvasRenderingContext2D, cameraPoasition: Position) {
  if (!MapData) return;
  for (let y = 0; y < MapData.length; y++) {
    for (let x = 0; x < MapData[y].length; x++) {
      const tile = MapData[y][x];
      if (tile !== 403) {
        const xPos = x * 16 + cameraPoasition.x;
        const yPos = y * 16;
        ctx.drawImage(
          tileset,
          (tile % 25) * 16,
          Math.floor(tile / 25) * 16,
          16,
          16,
          xPos,
          yPos,
          16,
          16
        );
      }
    }
  }
}
