import { TSprite } from "../types/Character";
import { Dimension, Position } from "../types/Position";
import { Player } from "./Player";

export class SpriteRender {
  Image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;

  private frameX = 0;
  private frameY = 0;
  private elapsedFrame = 0;
  iscompleted = false;

  constructor(sprite: TSprite) {
    this.Image = sprite.image;
    this.frameWidth = sprite.frameWidth;
    this.frameHeight = sprite.frameHeight;
    this.frameCount = sprite.frameCount;
  }

  public drawFrame(
    ctx: CanvasRenderingContext2D,
    position: Position,
    dimension: Dimension,
    reverse: boolean = false,
    cameraPosition: Position
  ) {
    ctx.save();
    if (reverse) {
      ctx.translate(position.x + dimension.width, position.y);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      this.Image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      reverse ? 0 - cameraPosition.x : position.x + cameraPosition.x,
      reverse ? 0 - cameraPosition.y : position.y + cameraPosition.y,
      this.frameWidth,
      this.frameHeight
    );
    if (reverse) ctx.restore();
  }

  switchSprite(image: TSprite) {
    this.frameX = 0;
    this.frameY = 0;
    this.frameHeight = image.frameHeight;
    this.frameWidth = image.frameWidth;
    this.Image = image.image;
    this.frameCount = image.frameCount;
    this.elapsedFrame = 0;
  }

  animateSprite(player?: Player) {
    this.elapsedFrame++;
    if (this.elapsedFrame % 10 === 0) this.frameX++;
    if (this.frameX >= this.frameCount) {
      this.frameX = 0;
      if (player) player.importantAnimationPlaying = false;
    }
  }
}
