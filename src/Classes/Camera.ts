import { TILE_WIDTH } from "../constants/Sprite";
import { Dimension, Position } from "../types/Position";

export default class Camera {
  position: Position = {
    x: 0,
    y: 0,
  };

  dimension: Dimension = {
    width: 200,
    height: 80,
  };

  constructor(position?: Position, dimension?: Dimension) {
    if (position) this.position = position;
    if (dimension) this.dimension = dimension;
  }

  update(playerPosition: Position) {
    this.position.x = playerPosition.x - 100;
    this.position.y = playerPosition.y;
  }

  public shouldPanCameraLeft(
    ctx: CanvasRenderingContext2D,
    cameraPosition: Position
  ) {
    const cameraRight = this.position.x + this.dimension.width;
    if (cameraRight >= 187 * TILE_WIDTH) return false;
    if (cameraRight >= ctx.canvas.width * 0.75 + Math.abs(cameraPosition.x))
      return true;
  }

  public shouldPanCameraRight(
    _: CanvasRenderingContext2D,
    cameraPosition: Position
  ) {
    if (this.position.x <= 0) return false;
    if (this.position.x <= Math.abs(cameraPosition.x)) return true;
  }
}
