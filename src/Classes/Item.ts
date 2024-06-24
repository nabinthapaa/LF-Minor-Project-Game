import { EITEM } from "../enums/Items";

export default class Item {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public type: EITEM
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "green";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
