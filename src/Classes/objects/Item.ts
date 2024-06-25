import { cameraPosition } from "../../constants/Canvas";
import { itemSprite } from "../../constants/Item";
import { EItem } from "../../enums/Items";
import { SolidObject } from "../../types/Position";
import { isCollisionBetween } from "../../utils/Collision";
import { SpriteRender } from "../SpriteRenderer";

export default class Item {
  sprite = "gold";
  render: SpriteRender = new SpriteRender(itemSprite[this.sprite]);
  width = itemSprite[this.sprite].frameWidth;
  height = itemSprite[this.sprite].frameHeight;
  offsetY = 20;
  shouldSpawnAtY: number;
  isMoving: boolean = true;

  constructor(public x: number, public y: number, public type: EItem) {
    this.sprite = type;
    this.shouldSpawnAtY = y;
    this.y = y - this.offsetY;
    this.render = new SpriteRender(itemSprite[this.sprite]);
  }

  public update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.move();
  }

  public move() {
    if (this.y !== this.shouldSpawnAtY) {
      this.y++;
    }
    if (this.y === this.shouldSpawnAtY) {
      this.isMoving = false;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.render.drawFrame(
      ctx,
      { x: this.x, y: this.y },
      { width: this.width, height: this.height },
      false,
      cameraPosition
    );
  }

  public isColldingWithPlayer(player: SolidObject) {
    return isCollisionBetween(player, this);
  }
}
