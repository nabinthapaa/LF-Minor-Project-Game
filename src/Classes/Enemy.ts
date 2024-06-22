import { beetoSprite } from "../constants/EnemySprite";
import { AttackVariant } from "../enums/Attack";
import { CharacterVariant } from "../enums/Character";
import { TVelocity } from "../types/Character";
import { Dimension, Position, SolidObject } from "../types/Position";
import { isCollisionBetween } from "../utils/Collision";
import { Character } from "./Character";
import { Player } from "./Player";
import { SpriteRender } from "./SpriteRenderer";

export class Enemy extends Character {
  sprite = "walk";
  health?: number | undefined;
  velocity: TVelocity = {
    x: 0.5,
    y: 0,
  };

  maxMoveDistance = 40;
  currentMoveDistance = 0;
  shouldFlip = false;

  dimension: Dimension = {
    width: beetoSprite[this.sprite].frameWidth,
    height: beetoSprite[this.sprite].frameHeight,
  };

  render = new SpriteRender(beetoSprite[this.sprite]);

  constructor(public cameraPosition: Position, public position: Position) {
    super(CharacterVariant.ENEMY, 100, [
      { name: AttackVariant.NORMAL, damage: 100 },
    ]);
    this.health = 100;
  }

  public renderEnemy(ctx: CanvasRenderingContext2D): void {
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

  get asSolidObject(): SolidObject {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimension.width,
      height: this.dimension.height,
    };
  }

  public isColliding(object: SolidObject): boolean {
    return isCollisionBetween(object, this.asSolidObject);
  }

  public takeDamage(damage: number): number {
    this.health = this.health ? this.health - damage : 0;
    return 0;
  }

  public attackCharacter(player: Player): number {
    if (this.isColliding(player.asSolidObject)) {
    }
    return 0;
  }

  public isAlive(): boolean {
    return !!this.health;
  }
}
