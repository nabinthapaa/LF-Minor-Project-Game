import { beetoSpriteImage } from "../images/preLoad";
import { TSprite } from "../types/Character";

export const beetoSprite: { [key: string]: TSprite } = {
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

export const bigDragonSprite: { [key: string]: TSprite } = {
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
