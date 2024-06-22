import { getImage } from "../utils/getAssest";

export const tileset = getImage('/plainsOfPassage.png')

export const playerSpriteImage:{[key:string]: HTMLImageElement} = {
  dig: getImage("/dig.png"),
  walk: getImage("/walk.png"),
  shine: getImage("/shine.png"),
  jump : getImage("/jump.png"),
  jumpAttack : getImage("/jumpAttack.png"),
  jumpNormal : getImage("/jump2.png"),
  victory : getImage("/victory.png"),
};

export const beetoSpriteImage:{[key:string]: HTMLImageElement} = {
  walk: getImage("/beetoWalk.png"),
  die: getImage("/beetoFlip.png"),
}

export const gameSprite:{[key:string]: HTMLImageElement} = {
  background : getImage("/background.jfif"),
  map : getImage("/map.png"),
  extended : getImage("/extended_background.png"),
}