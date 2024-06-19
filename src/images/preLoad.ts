import { getImage } from "../utils/getAssest";

const dig = getImage("/dig.png");
const walk = getImage("/walk.png");
const shine = getImage("/shine.png");
const jump = getImage("/jump.png");
const jumpAttack = getImage("/jumpAttack.png");
const jumpNormal = getImage("/jump2.png");
const victory = getImage("/victory.png");

const background = getImage("/background.jfif");
const map = getImage("/map.png");

export const tileset = getImage('/plainsOfPassage.png')

export const playerSpriteImage:{[key:string]: HTMLImageElement} = {
  dig,
  walk,
  shine,
  jump,
  jumpAttack,
  jumpNormal,
  victory,
};

export const gameSprite:{[key:string]: HTMLImageElement} = {
  background,
  map
}