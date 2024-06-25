import { cameraPosition } from "../../constants/Canvas";
import { dirtPileSpirte } from "../../constants/DirtPile";
import { SolidObject } from "../../types/Position";
import { SpriteRender } from "../SpriteRenderer";

export default class DirtPile {
  render: SpriteRender = new SpriteRender(dirtPileSpirte);
  width: number = dirtPileSpirte.frameWidth;
  height: number = dirtPileSpirte.frameHeight;
  health: number = 90;
  lastDamageTime: number = 0;

  constructor(public x: number, public y: number) {
    this.lastDamageTime = Date.now();
  }

  public update(ctx: CanvasRenderingContext2D) {
    this.lastDamageTime =
      Date.now() - this.lastDamageTime > 1000 ? 0 : this.lastDamageTime;
    this.draw(ctx);
  }

  private draw(ctx: CanvasRenderingContext2D) {
    this.render.drawFrame(
      ctx,
      { x: this.x, y: this.y },
      { width: this.width, height: this.height },
      false,
      cameraPosition
    );
  }

  public isColldingWithPlayer(player: SolidObject) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  public takeDamage(damage: number) {
    if (this.lastDamageTime === 0) {
      this.health -= damage;
      this.render.increaseFrameX();
      this.lastDamageTime = Date.now();
    }
  }
}
