import { bubbleSprite } from "../../constants/EnemySprite";
import { Position, SolidObject } from "../../types/Position";
import { isCollisionBetween } from "../../utils/Collision";
import { SpriteRender } from "../SpriteRenderer";

export default class Bubble {
  position: Position = {
    x: 0,
    y: 0,
  };
  dimension = {
    width: bubbleSprite["bubble"].frameWidth,
    height: bubbleSprite["bubble"].frameHeight,
  };
  velocity = {
    x: 1,
    y: 1,
  };

  maxMoveDistance = 60;
  currentMoveDistance = 0;
  renderer = new SpriteRender(bubbleSprite["bubble"]);

  constructor(public cameraPosition: Position, position: Position) {
    this.position = position;
  }

  public update(ctx: CanvasRenderingContext2D): void {
    this.renderer.animateSprite();
    this.renderer.drawFrame(
      ctx,
      this.position,
      this.dimension,
      false,
      this.cameraPosition
    );
  }

  public move(): void {
    if (this.currentMoveDistance >= this.maxMoveDistance) {
      this.position.y -= this.velocity.y;
    } else {
      this.currentMoveDistance++;
      this.position.x -= this.velocity.x;
    }
  }

  public isOutOfBounds(): boolean {
    return this.position.y <= 0;
  }

  get asSolidObject(): SolidObject {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimension.width,
      height: this.dimension.height,
    };
  }

  public isCollidingWithObject(object: SolidObject): boolean {
    return isCollisionBetween(object, this.asSolidObject);
  }
}
