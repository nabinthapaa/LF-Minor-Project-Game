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
  width: number;
  height: number;
  frameCount: number;
};

export type TSpriteDimensions = {
  [key: string]: TSprite;
};

export type TSpriteImage = {
  [key: string]: HTMLImageElement;
};
