import { gemsSpriteImage } from "../images/preLoad";
import { TSprite } from "../types/Character";

export const itemSprite: Record<string, TSprite> = {
  gold: {
    image: gemsSpriteImage.gold,
    frameWidth: 16,
    frameHeight: 16,
    frameCount: 1,
  },
  diamond: {
    image: gemsSpriteImage.diamond,
    frameWidth: 17,
    frameHeight: 13,
    frameCount: 1,
  },
  redGem: {
    image: gemsSpriteImage.redGem,
    frameWidth: 12,
    frameHeight: 12,
    frameCount: 1,
  },
  purpleGem: {
    image: gemsSpriteImage.purpleGem,
    frameWidth: 9,
    frameHeight: 15,
    frameCount: 1,
  },
};
