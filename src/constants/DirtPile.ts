import DirtPile from "../Classes/DirtPile";
import { dirtPileImage } from "../images/preLoad";
import { TSprite } from "../types/Character";

export const dirtPileSpirte: TSprite = {
  image: dirtPileImage,
  frameWidth: 35,
  frameHeight: 15,
  frameCount: 1,
};

const dirtBlockLocationLvl1 = [
  { x: 231, y: 340 },
  { x: 1072, y: 308 },
  { x: 958, y: 260 },
  { x: 1515, y: 340 },
  { x: 1980, y: 260 },
];

export const dirtPileLocationLVl1 = dirtBlockLocationLvl1.map(
  (location) => new DirtPile(location.x, location.y)
);
