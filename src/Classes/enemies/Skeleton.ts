import { beetoSprite, skeletonSprite } from "../../constants/EnemySprite";
import { TVelocity } from "../../types/Character";
import { Dimension, Position } from "../../types/Position";
import Player from "../Player";
import { SpriteRender } from "../SpriteRenderer";
import { Enemy } from "./Enemy";

export default class Skeleton extends Enemy {
  sprite = "idle";
  velocity: TVelocity = {
    x: 0.5,
    y: 0,
  };

  dimension: Dimension = {
    width: skeletonSprite[this.sprite].frameWidth,
    height: skeletonSprite[this.sprite].frameHeight,
  };

  render = new SpriteRender(skeletonSprite[this.sprite]);
  isAttacking: boolean = false;
  attackTimer: number = 0;
  currentSprite: string = "idle";

  constructor(
    public cameraPosition: Position,
    public position: Position,
    maxMoveDistance: number = 90
  ) {
    super(cameraPosition, position);
    this.health = 100;
    this.maxMoveDistance = maxMoveDistance;
    this.shouldFlip = false;
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

  public update(player: Player, ctx: CanvasRenderingContext2D): void {
    if (this.isAttacking) this.sprite = "attack";
    else this.sprite = "idle";
    this.renderEnemy(player, ctx);
    this.switchSprite();
    this.drawHealthBar(ctx);
  }

  private switchSprite(): void {
    if (this.sprite === this.currentSprite) return;
    this.currentSprite = this.sprite;
    this.dimension = {
      width: skeletonSprite[this.sprite].frameWidth,
      height: skeletonSprite[this.sprite].frameHeight,
    };
    this.render.switchSprite(skeletonSprite[this.sprite]);
  }

  public move(): void {
    if (!this.isAlive()) return;
    this.sprite = "walk";
    if (this.currentMoveDistance >= this.maxMoveDistance) {
      this.velocity.x = -this.velocity.x;
      this.currentMoveDistance = 0;
      this.shouldFlip = !this.shouldFlip;
    }
    this.position.x += this.velocity.x;
    this.currentMoveDistance += Math.abs(this.velocity.x);
  }

  public attackPlayer() {
    if (this.isAttacking) {
      this.sprite = "attack";
      this.lastAttack = Date.now();
      return;
    }
    if (!this.isAttacking) {
      this.attackTimer = 0;
      this.lastAttack = 0;
      this.sprite = "walk";
    }
  }
}
