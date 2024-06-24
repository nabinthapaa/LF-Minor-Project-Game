import DirtPile from "../Classes/DirtPile";
import { Obstacle } from "../Classes/Obstacle";
import Platform from "../Classes/Platform";
import { Enemy } from "../Classes/enemies/Enemy";
import Level1Map from "../MapData/mapData.json";
import Level2Map from "../MapData/mapData2.json";
import { dirtPileLocationLVl1 } from "../constants/DirtPile";
import { beetoLvl1, bigDragon } from "../constants/EnemyLocation";
import {
  bigDirtBlockLvl1,
  bigDirtBlockLvl2,
} from "../constants/ObstaclePosition";
import { getCollisionMap, makePlatforms } from "../map/MapMaker";

interface ILevelData {
  map: number[][];
  enemies: Enemy[];
  obstacles: Obstacle[];
  platforms: Platform[];
  dirtPiles: DirtPile[];
}

export const level1: ILevelData = {
  map: Level1Map,
  enemies: [...beetoLvl1],
  obstacles: bigDirtBlockLvl1,
  platforms: makePlatforms(getCollisionMap(Level1Map)),
  dirtPiles: [...dirtPileLocationLVl1],
};

export const level2: ILevelData = {
  map: Level2Map,
  enemies: [bigDragon],
  obstacles: bigDirtBlockLvl2,
  platforms: makePlatforms(getCollisionMap(Level2Map)),
  dirtPiles: [],
};

export const levelInfo: { [key: string]: ILevelData } = {
  1: level1,
  2: level2,
};
