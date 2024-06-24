import { AttackVariant } from "../enums/Attack";

export type TAttack = {
  name: AttackVariant;
  damage: number;
};

export type TVelocity = {
  x: number;
  y: number;
};

export type TSprite = {
  image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
};

