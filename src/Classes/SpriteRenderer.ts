import { Canvas } from "../constants/Canvas";
import { TSprite } from "../types/Character";
import { Position } from "../types/Position";
import { Player } from "./Player";

export class SpriteRender {
  private frameX = 0;
  private frameY = 0;
  private elapsedFrame = 0;
  iscompleted = false;
  constructor(
    public Image: HTMLImageElement,
    public frameWidth: number,
    public frameHeight: number,
    public frameCount: number
  ) {}

  private drawFramePrivate(ctx: CanvasRenderingContext2D, position: Position) {
    ctx.drawImage(
      this.Image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      position.x,
      position.y,
      this.frameWidth * Canvas.SCALE,
      this.frameHeight * Canvas.SCALE
    );
  }

  public drawFrame(
    ctx: CanvasRenderingContext2D,
    position: Position,
    reverse: boolean = false
  ) {
    if (reverse) {
      ctx.save();
      this.drawFramePrivate(ctx, position);
      ctx.restore();
    } else {
      this.drawFramePrivate(ctx, position);
    }
  }

  switchSprite(image: TSprite) {
    this.frameX = 0;
    this.frameY = 0;
    this.frameHeight = image.height;
    this.frameWidth = image.width;
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
