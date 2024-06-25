import Beeto from "../Classes/enemies/Beeto";
import BigDragon from "../Classes/enemies/BigDragon";
import Boss from "../Classes/enemies/Boss";
import Skeleton from "../Classes/enemies/Skeleton";
import { cameraPosition } from "./Canvas";

interface EnemyLocation {
  position: { x: number; y: number };
  mvd?: number;
}

const enemyDragonLocation = {
  x: 2780,
  y: 125,
};

const boss: EnemyLocation = { position: { x: 320, y: 317 } };

const beetoLocationLv1: EnemyLocation[] = [
  { position: { x: 629, y: 340 }, mvd: 40 },
  { position: { x: 936, y: 340 }, mvd: 20 },
  { position: { x: 1266, y: 292 }, mvd: 40 },
  { position: { x: 2109, y: 228 }, mvd: 40 },
  { position: { x: 2505, y: 335 }, mvd: 20 },
];

const beetoLocationLv2: EnemyLocation[] = [
  { position: { x: 2321, y: 190 } },
  { position: { x: 1811, y: 190 } },
  { position: { x: 1442, y: 190 } },
  { position: { x: 502, y: 142 } },
  { position: { x: 444, y: 286 } },
  { position: { x: 261, y: 286 } },
  { position: { x: 168, y: 334 } },
];

const beetoLocationLv3: EnemyLocation[] = [
  { position: { x: 395, y: 195 }, mvd: 30 },
  { position: { x: 996, y: 270 }, mvd: 20 },
  { position: { x: 1074, y: 270 }, mvd: 20 },
  { position: { x: 1460, y: 30 }, mvd: 20 },
  { position: { x: 1745, y: 215 }, mvd: 20 },
  { position: { x: 2903, y: 215 }, mvd: 30 },
];

const skeletonLocationLv1: EnemyLocation[] = [
  { position: { x: 629, y: 325 }, mvd: 90 },
  { position: { x: 1434, y: 328 } },
  { position: { x: 1770, y: 328 } },
  { position: { x: 2091, y: 216 } },
  { position: { x: 2319, y: 328 }, mvd: 20 },
  { position: { x: 2592, y: 328 }, mvd: 20 },
];
const skeleLocationLv2: EnemyLocation[] = [
  { position: { x: 609, y: 328 }, mvd: 20 },
  { position: { x: 575, y: 136 } },
  { position: { x: 638, y: 56 }, mvd: 20 },
  { position: { x: 911, y: 56 } },
  { position: { x: 1200, y: 184 }, mvd: 10 },
  { position: { x: 1615, y: 184 } },
  { position: { x: 2035, y: 184 } },
  { position: { x: 2554, y: 184 } },
];
const sekeleLocationLv3: EnemyLocation[] = [
  { position: { x: 280, y: 245 }, mvd: 25 },
  { position: { x: 826, y: 310 } },
  { position: { x: 1115, y: 20 } },
  { position: { x: 1721, y: 190 } },
  { position: { x: 2557, y: 190 } },
  { position: { x: 2799, y: 260 } },
  { position: { x: 3027, y: 150 } },
];

// Beeto Locations for Each level
export const beetoLvl1: Beeto[] = beetoLocationLv1.map(
  (location) => new Beeto(cameraPosition, location.position, location.mvd)
);

export const beetoLvl2: Beeto[] = beetoLocationLv2.map(
  (location) => new Beeto(cameraPosition, location.position, location.mvd)
);

export const beetoLvl3: Beeto[] = beetoLocationLv3.map(
  (location) => new Beeto(cameraPosition, location.position, location.mvd)
);

// Skeletons Locations for Each level
export const skeletonLvl1: Skeleton[] = skeletonLocationLv1.map(
  (location) => new Skeleton(cameraPosition, location.position, location.mvd)
);

export const skeletonLvl2: Skeleton[] = skeleLocationLv2.map(
  (location) => new Skeleton(cameraPosition, location.position, location.mvd)
);
export const skeletonLvl3: Skeleton[] = sekeleLocationLv3.map(
  (location) =>
    new Skeleton(
      cameraPosition,
      location.position,
      location?.mvd ? location.mvd : 20
    )
);

export const bossLvl1 = new Boss(cameraPosition, boss.position);

export const bigDragon: BigDragon = new BigDragon(
  cameraPosition,
  enemyDragonLocation
);
