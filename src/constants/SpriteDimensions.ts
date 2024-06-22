import { playerSpriteImage } from "../images/preLoad";
import { TSpriteDimensions } from "../types/Character";

export const PlayerSpriteDimensions: TSpriteDimensions = {
  dig: {
    image: playerSpriteImage.dig,
    frameWidth: 56,
    frameHeight: 35,
    frameCount: 4,
  },
  walk: {
    image: playerSpriteImage.walk,
    frameWidth: 42,
    frameHeight: 35,
    frameCount: 6,
  },
  shine: {
    image: playerSpriteImage.shine,
    frameWidth: 35,
    frameHeight: 32,
    frameCount: 3,
  },
  jump: {
    image: playerSpriteImage.jump,
    frameWidth: 33,
    frameHeight: 34,
    frameCount: 1,
  },
  jumpAttack: {
    image: playerSpriteImage.jumpAttack,
    frameWidth: 26,
    frameHeight: 36,
    frameCount: 1,
  },
  jumpNormal: {
    image: playerSpriteImage.jumpNormal,
    frameWidth: 35,
    frameHeight: 34,
    frameCount: 1,
  },
  victory: {
    image: playerSpriteImage.victory,
    frameWidth: 62,
    frameHeight: 51,
    frameCount: 9,
  },
};
