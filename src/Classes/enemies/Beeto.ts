import { beetoSprite } from "../../constants/EnemySprite";
import { TVelocity } from "../../types/Character";
import { Dimension, Position } from "../../types/Position";
import Player from "../Player";
import { SpriteRender } from "../SpriteRenderer";
import { Enemy } from "./Enemy";

export default class Beeto extends Enemy {
  sprite = "walk";
  velocity: TVelocity = {
    x: 0.5,
    y: 0,
  };

  dimension: Dimension = {
    width: beetoSprite[this.sprite].frameWidth,
    height: beetoSprite[this.sprite].frameHeight,
  };

  render = new SpriteRender(beetoSprite[this.sprite]);

  constructor(
    public cameraPosition: Position,
    public position: Position,
    maxMoveDistance: number = 40
  ) {
    super(cameraPosition, position);
    this.health = 100;
    this.maxMoveDistance = maxMoveDistance;
  }

  public renderEnemy(_: Player, ctx: CanvasRenderingContext2D): void {
    this.render.animateSprite();
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition
    );
  }

  public update(_: Player, ctx: CanvasRenderingContext2D) {
    this.renderEnemy(_, ctx);
    this.drawHealthBar(ctx);
  }

  public move(): void {
    if (!this.isAlive()) return;
    if (this.currentMoveDistance >= this.maxMoveDistance) {
      this.velocity.x = -this.velocity.x;
      this.currentMoveDistance = 0;
      this.shouldFlip = !this.shouldFlip;
    }
    this.position.x += this.velocity.x;
    this.currentMoveDistance += Math.abs(this.velocity.x);
  }
}
