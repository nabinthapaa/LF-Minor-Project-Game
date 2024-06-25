import { getImage } from "../utils/getAssest";

export const tileset: HTMLImageElement = getImage("/plainsOfPassage.png");

export const playerSpriteImage: Record<string, HTMLImageElement> = {
  dig: getImage("/dig.png"),
  walk: getImage("/walk.png"),
  shine: getImage("/shine.png"),
  jump: getImage("/jump.png"),
  jumpAttack: getImage("/jumpAttack.png"),
  jumpNormal: getImage("/jump2.png"),
  victory: getImage("/victory.png"),
  idle: getImage("/idle.png"),
};

export const beetoSpriteImage: Record<string, HTMLImageElement> = {
  walk: getImage("/beetoWalk.png"),
  die: getImage("/beetoFlip.png"),
};

export const gameSprite: Record<string, HTMLImageElement> = {
  background: getImage("/background.jfif"),
  map: getImage("/map.png"),
  extended: getImage("/extended_background.png"),
};

export const obstacleSpriteImage: Record<string, HTMLImageElement> = {
  bigBlock: getImage("/dirtBlockBig.png"),
  smallBlock: getImage("/dirtBlockSmall.png"),
  bigBlockBroken: getImage("/dirtBlockBigExplode.png"),
  smallBlockBroken: getImage("/dirtBlockSmallExplode.png"),
};

export const BigDragonSpriteImage: Record<string, HTMLImageElement> = {
  sleep: getImage("/bigDragonSleep.png"),
  moveFront: getImage("/bigDragonMoveFront.png"),
  moveBack: getImage("/bigDragonMoveBack.png"),
  attack: getImage("/bigDragonAttack.png"),
};

export const bubbleSpriteImage: Record<string, HTMLImageElement> = {
  bubble: getImage("/bubbles.png"),
};

export const gemsSpriteImage: Record<string, HTMLImageElement> = {
  purpleGem: getImage("/gem1.png"),
  redGem: getImage("/gem2.png"),
  diamond: getImage("/gem3.png"),
  gold: getImage("/gem4.png"),
};

export const skeletonSpriteImage: Record<string, HTMLImageElement> = {
  walk: getImage("/skeletonWalk.png"),
  attack: getImage("/skeletonAttack.png"),
  idle: getImage("/skeletonIdle.png"),
};

export const dirtPileImage: HTMLImageElement = getImage("/dirtPile.png");
