import Beeto from "../Classes/enemies/Beeto";
import BigDragon from "../Classes/enemies/BigDragon";
import Boss from "../Classes/enemies/Boss";
import Skeleton from "../Classes/enemies/Skeleton";
import { cameraPosition } from "./Canvas";

const enemyDragonLocation = {
  x: 2780,
  y: 125,
};

export const bigDragon: BigDragon = new BigDragon(
  cameraPosition,
  enemyDragonLocation
);

const beetoLocationLv1 = [
  { x: 629, y: 340, mvd: 40 },
  { x: 936, y: 340, mvd: 20 },
  { x: 1266, y: 292, mvd: 40 },
  { x: 2109, y: 228, mvd: 40 },
];

const boss = { x: 320, y: 317 };

export const beetoLvl1: Beeto[] = beetoLocationLv1.map(
  (location) => new Beeto(cameraPosition, location, location.mvd)
);

const skeletonLocationLv1 = [{ x: 629, y: 325, mvd: 90 }];

export const skeletonLvl1: Beeto[] = skeletonLocationLv1.map(
  (location) => new Skeleton(cameraPosition, location, location.mvd)
);

export const bossLvl1 = new Boss(cameraPosition, boss);
