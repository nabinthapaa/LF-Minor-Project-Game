import { obstacleSpriteImage } from "../images/preLoad";
import { TSprite } from "../types/Character";

export const obstacleSprite: Record<string, TSprite> = {
  smallDirtBlock: {
    image: obstacleSpriteImage.smallBlock,
    frameWidth: 16,
    frameHeight: 16,
    frameCount: 1,
  },
  bigDirtBlock: {
    image: obstacleSpriteImage.bigBlock,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 1,
  },
  bigDirtBlockBroken: {
    image: obstacleSpriteImage.bigBlockBroken,
    frameWidth: 47,
    frameHeight: 38,
    frameCount: 3,
  },
};
