import { Obstacle } from "../Classes/objects/Obstacle";
import { Position } from "../types/Position";
import { obstacleSprite } from "./ObstacleSprite";

export const bigDirtBlockPostionLvl1: Position[] = [
  { x: 672, y: 257 },
  { x: 1170, y: 242 },
  { x: 1902, y: 272 },
  { x: 2237, y: 320 },
  { x: 2681, y: 320 },
  { x: 2681, y: 288 },
  { x: 2681, y: 256 },
];

export const bigDirtBlockPostionLv2: Position[] = [
  { x: 114, y: 220 },
  { x: 114, y: 252 },
  { x: 114, y: 284 },
  { x: 66, y: 288 },
  { x: 66, y: 320 },
  { x: 1030, y: 173 },
  { x: 708, y: 319 },
];

export const bigDirtBlockPostionLv3: Position[] = [
  { x: 465, y: 180 },
  { x: 642, y: 305 },
  { x: 642, y: 273 },
  { x: 675, y: 305 },
  { x: 1272, y: 301 },
  { x: 1568, y: 125 },
  { x: 1568, y: 125 },
  { x: 1976, y: 253 },
  { x: 1976, y: 253 },
  { x: 2033, y: 253 },
  { x: 2184, y: 109 },
  { x: 2434, y: 189 },
  { x: 2434, y: 189 },
  { x: 2500, y: 189 },
  { x: 2672, y: 301 },
];

export const bigDirtBlockLvl1: Obstacle[] = bigDirtBlockPostionLvl1.map(
  (position) => new Obstacle(position, obstacleSprite["bigDirtBlock"])
);

export const bigDirtBlockLvl2: Obstacle[] = bigDirtBlockPostionLv2.map(
  (position) => new Obstacle(position, obstacleSprite["bigDirtBlock"])
);

export const bigDirtBlockLvl3: Obstacle[] = bigDirtBlockPostionLv3.map(
  (position) => new Obstacle(position, obstacleSprite["bigDirtBlock"])
);
