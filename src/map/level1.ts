import Platform from "../Classes/Platform";
import { Canvas } from "../constants/Canvas";
import { EPlatform } from "../enums/Platform";
import mapData from "./mapData2.json";

// TODO: Move to constants if works
const collisionLevel1Tiles = new Set([
  356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370,
  372, 373, 374, 379, 380, 381, 384, 385, 386, 387, 388, 389, 390, 391, 392,
  393, 394, 395, 398, 399, 400, 401, 297,
]);

export const Mapdata: number[][] = mapData;

export function getCollisionMap(Mapdata: number[][]) {
  let floorCollisions: number[][] = [];
  for (let y = 0; y < Mapdata.length; y++) {
    floorCollisions[y] = [];
    for (let x = 0; x < Mapdata[y].length; x++) {
      let currentTile = Mapdata[y][x];
      switch (true) {
        case currentTile === 403:
          floorCollisions[y][x] = EPlatform.PASSTHROUGH;
          break;
        case collisionLevel1Tiles.has(currentTile):
          floorCollisions[y][x] = EPlatform.COLLIDABLE;
          break;
        case currentTile === 355:
          floorCollisions[y][x] = EPlatform.CLIMBABLE;
          break;
        case currentTile === 397:
          floorCollisions[y][x] = EPlatform.LETHAL;
          break;
        default:
          floorCollisions[y][x] = EPlatform.PASSTHROUGH;
      }
    }
  }
  return floorCollisions;
}

export function makePlatforms(floorCollisions: number[][]) {
  let platforms: Platform[] = [];
  for (let y = 0; y < floorCollisions.length; y++) {
    for (let x = 0; x < floorCollisions[y].length; x++) {
      if (floorCollisions[y][x] === EPlatform.CLIMBABLE)
        platforms.push(
          new Platform(x * 16, y * 16, 16, 16, EPlatform.CLIMBABLE)
        );

      if (floorCollisions[y][x] === EPlatform.LETHAL)
        platforms.push(new Platform(x * 16, y * 16, 16, 16, EPlatform.LETHAL));

      if (floorCollisions[y][x] === EPlatform.COLLIDABLE) {
        if (
          isTopPlatformColidable(x, y, floorCollisions) &&
          isBottomPlatformColidable(x, y, floorCollisions) &&
          isLeftPlatformColidable(x, y, floorCollisions) &&
          isRightPlatformColidable(x, y, floorCollisions)
        ) {
          continue;
        } else if (
          isTopPlatformColidable(x, y, floorCollisions) &&
          isRightPlatformColidable(x, y, floorCollisions) &&
          isLeftPlatformColidable(x, y, floorCollisions) &&
          isPlatformOnBottomOfCanvas(y)
        )
          continue;
        else if (
          isTopPlatformColidable(x, y, floorCollisions) &&
          isLeftPlatformColidable(x, y, floorCollisions) &&
          isBottomPlatformColidable(x, y, floorCollisions)
        ) {
          platforms.push(
            new Platform(x * 16, y * 16, 16, 16, EPlatform.COLLIDABLE, true)
          );
          continue;
        } else if (
          isTopPlatformColidable(x, y, floorCollisions) &&
          isRightPlatformColidable(x, y, floorCollisions) &&
          isBottomPlatformColidable(x, y, floorCollisions)
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
  return platforms;
}

function isTopPlatformColidable(
  x: number,
  y: number,
  floorCollisions: number[][]
) {
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

function isBottomPlatformColidable(
  x: number,
  y: number,
  floorCollisions: number[][]
) {
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

function isLeftPlatformColidable(
  x: number,
  y: number,
  floorCollisions: number[][]
) {
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

function isRightPlatformColidable(
  x: number,
  y: number,
  floorCollisions: number[][]
) {
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
