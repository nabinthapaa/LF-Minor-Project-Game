import { EPlatform } from "../../enums/Platform";
import { SolidObject } from "../../types/Position";

export default class Platform implements SolidObject {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public type: EPlatform,
    public isWall: boolean = false
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
