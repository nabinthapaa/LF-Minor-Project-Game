import { Enemy } from "../Classes/enemies/Enemy";
import DirtPile from "../Classes/objects/DirtPile";
import { Obstacle } from "../Classes/objects/Obstacle";
import Platform from "../Classes/objects/Platform";
import Level1Map from "../MapData/mapData.json";
import Level2Map from "../MapData/mapData2.json";
import Level3Map from "../MapData/mapData3.json";
import {
  dirtPilesLvl1,
  dirtPilesLvl2,
  dirtPilesLvl3,
} from "../constants/DirtPile";
import {
  beetoLvl1,
  beetoLvl2,
  beetoLvl3,
  bigDragon,
  skeletonLvl1,
  skeletonLvl2,
  skeletonLvl3,
} from "../constants/EnemyLocation";
import {
  bigDirtBlockLvl1,
  bigDirtBlockLvl2,
  bigDirtBlockLvl3,
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
  enemies: [...beetoLvl1, ...skeletonLvl1],
  obstacles: bigDirtBlockLvl1,
  platforms: makePlatforms(getCollisionMap(Level1Map)),
  dirtPiles: [...dirtPilesLvl1],
};

export const level2: ILevelData = {
  map: Level2Map,
  enemies: [...beetoLvl2, ...skeletonLvl2, bigDragon],
  obstacles: bigDirtBlockLvl2,
  platforms: makePlatforms(getCollisionMap(Level2Map)),
  dirtPiles: [...dirtPilesLvl2],
};

export const level3: ILevelData = {
  map: Level3Map,
  enemies: [...skeletonLvl3, ...beetoLvl3],
  obstacles: bigDirtBlockLvl3,
  platforms: makePlatforms(getCollisionMap(Level3Map)),
  dirtPiles: [...dirtPilesLvl3],
};

export const levelInfo: { [key: string]: ILevelData } = {
  1: level1,
  2: level2,
  3: level3,
};
