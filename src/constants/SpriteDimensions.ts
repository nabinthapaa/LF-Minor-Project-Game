import { TSpriteDimensions } from "../types/Character";
import {playerSpriteImage} from "../images/preLoad";

export const PlayerSpriteDimensions:TSpriteDimensions  = {
  dig: {
    image: playerSpriteImage.dig,
    width: 56,
    height: 35,
    frameCount: 4,
  },
  walk: {
    image: playerSpriteImage.walk,
    width: 42,
    height: 35,
    frameCount: 6,
  },
  shine: {
    image: playerSpriteImage.shine,
    width: 35,
    height: 32,
    frameCount: 3,   
  },
  jump:{
    image: playerSpriteImage.jump,
    width: 33,
    height: 34,
    frameCount: 1,
  },
  jumpAttack:{
    image: playerSpriteImage.jumpAttack,
    width: 26,
    height: 36,
    frameCount: 1,
  },
  jumpNormal:{
    image: playerSpriteImage.jumpNormal,
    width: 35,
    height: 34,
    frameCount: 1,
  },
  victory:{
    image: playerSpriteImage.victory,
    width: 62,
    height: 51,
    frameCount: 9,
  }
};
