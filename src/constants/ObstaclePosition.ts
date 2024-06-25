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

export const bigDirtBlockLvl1: Obstacle[] = bigDirtBlockPostionLvl1.map(
  (position) => new Obstacle(position, obstacleSprite["bigDirtBlock"])
);

export const bigDirtBlockLvl2: Obstacle[] = bigDirtBlockPostionLv2.map(
  (position) => new Obstacle(position, obstacleSprite["bigDirtBlock"])
);
