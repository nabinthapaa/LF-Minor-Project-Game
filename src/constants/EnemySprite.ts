import {
  BigDragonSpriteImage,
  beetoSpriteImage,
  bubbleSpriteImage,
} from "../images/preLoad";
import { TSprite } from "../types/Character";

export const beetoSprite: Record<string, TSprite> = {
  walk: {
    image: beetoSpriteImage.walk,
    frameWidth: 28,
    frameHeight: 16,
    frameCount: 4,
  },
  flip: {
    image: beetoSpriteImage.walk,
    frameWidth: 26,
    frameHeight: 16,
    frameCount: 2,
  },
};

export const bigDragonSprite: Record<string, TSprite> = {
  sleep: {
    image: BigDragonSpriteImage.sleep,
    frameWidth: 183,
    frameHeight: 88,
    frameCount: 12,
  },
  moveFront: {
    image: BigDragonSpriteImage.moveFront,
    frameWidth: 180,
    frameHeight: 89,
    frameCount: 6,
  },
  moveBack: {
    image: BigDragonSpriteImage.moveBack,
    frameWidth: 180,
    frameHeight: 89,
    frameCount: 6,
  },
  attack: {
    image: BigDragonSpriteImage.attack,
    frameWidth: 180,
    frameHeight: 83,
    frameCount: 1,
  },
};

export const bubbleSprite: Record<string, TSprite> = {
  bubble: {
    image: bubbleSpriteImage.bubble,
    frameWidth: 29,
    frameHeight: 27,
    frameCount: 2,
  },
};
