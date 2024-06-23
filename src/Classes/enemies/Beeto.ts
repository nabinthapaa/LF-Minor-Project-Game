import { beetoSprite } from "../../constants/EnemySprite";
import { TVelocity } from "../../types/Character";
import { Dimension, Position } from "../../types/Position";
import { Player } from "../Player";
import { SpriteRender } from "../SpriteRenderer";
import { Enemy } from "./Enemy";

export class Beeto extends Enemy {
  sprite = "walk";
  health?: number | undefined;
  velocity: TVelocity = {
    x: 0.5,
    y: 0,
  };

  maxMoveDistance = 40;
  currentMoveDistance = 0;
  shouldFlip = false;
  damageTimeout: ReturnType<typeof setTimeout> | null = null;
  shouldDamage = true;

  dimension: Dimension = {
    width: beetoSprite[this.sprite].frameWidth,
    height: beetoSprite[this.sprite].frameHeight,
  };

  render = new SpriteRender(beetoSprite[this.sprite]);

  constructor(public cameraPosition: Position, public position: Position) {
    super(cameraPosition, position);
    this.health = 100;
  }

  public renderEnemy(_: Player, ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive()) {
      this.dimension = {
        width: 0,
        height: 0,
      };
      this.position = {
        x: 0,
        y: 0,
      };
    }
    this.render.animateSprite();
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition
    );
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
