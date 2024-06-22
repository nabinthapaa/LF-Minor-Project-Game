import { TSprite } from "../types/Character";
import { Dimension, Position, SolidObject } from "../types/Position";
import { isCollisionBetween } from "../utils/Collision";
import Camera from "./Camera";
import { SpriteRender } from "./SpriteRenderer";

export class Obstacle {
  render: SpriteRender;
  dimension: Dimension;
  isCollidable = true;
  isAnimationRunning = true;

  constructor(public position: Position, public sprite: TSprite) {
    this.render = new SpriteRender(sprite);
    this.dimension = {
      width: sprite.frameWidth,
      height: sprite.frameHeight,
    };
  }

  public isColliding(object: SolidObject): boolean {
    return isCollisionBetween(object, this.asSolidObject);
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Position) {
    if (this.sprite.frameCount > 1)
      this.isAnimationRunning = this.render.animateSprite();
    this.render.drawFrame(ctx, this.position, this.dimension, false, camera);
  }

  public switchSprite(sprite: TSprite) {
    this.sprite = sprite;
    this.render.switchSprite(sprite, 2);
    this.isCollidable = false;
  }

  public update(camera: Camera) {
    this.position.x -= camera.position.x;
  }

  get asSolidObject(): SolidObject {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimension.width,
      height: this.dimension.height,
    };
  }
}
