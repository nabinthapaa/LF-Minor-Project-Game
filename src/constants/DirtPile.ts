import DirtPile from "../Classes/objects/DirtPile";
import { dirtPileImage } from "../images/preLoad";
import { TSprite } from "../types/Character";

export const dirtPileSpirte: TSprite = {
  image: dirtPileImage,
  frameWidth: 35,
  frameHeight: 15,
  frameCount: 1,
};

const dirtPileLocationLvl1 = [
  { x: 231, y: 340 },
  { x: 1072, y: 308 },
  { x: 958, y: 260 },
  { x: 1515, y: 340 },
  { x: 1980, y: 260 },
];

const dirtPileLocationLvl2 = [
  { x: 600, y: 341 },
  { x: 653, y: 149 },
  { x: 646, y: 69 },
  { x: 910, y: 69 },
  { x: 1216, y: 197 },
  { x: 1816, y: 197 },
  { x: 2197, y: 197 },
];

const dirtPileLocationLvl3 = [
  { x: 105, y: 325 },
  { x: 550, y: 117 },
  { x: 758, y: 325 },
  { x: 1194, y: 325 },
  { x: 1000, y: 37 },
  { x: 1814, y: 166 },
  { x: 2102, y: 277 },
  { x: 2271, y: 133 },
  { x: 2728, y: 325 },
];

export const dirtPilesLvl1 = dirtPileLocationLvl1.map(
  (location) => new DirtPile(location.x, location.y)
);

export const dirtPilesLvl2 = dirtPileLocationLvl2.map(
  (location) => new DirtPile(location.x, location.y)
);

export const dirtPilesLvl3 = dirtPileLocationLvl3.map(
  (location) => new DirtPile(location.x, location.y)
);
