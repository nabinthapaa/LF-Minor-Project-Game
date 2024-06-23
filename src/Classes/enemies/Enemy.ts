import { beetoSprite } from "../../constants/EnemySprite";
import { AttackVariant } from "../../enums/Attack";
import { CharacterVariant } from "../../enums/Character";
import { TVelocity } from "../../types/Character";
import { Dimension, Position, SolidObject } from "../../types/Position";
import { isCollisionBetween } from "../../utils/Collision";
import { Character } from "../Character";
import { Player } from "../Player";
import { SpriteRender } from "../SpriteRenderer";

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
  damageTimeout: ReturnType<typeof setTimeout> | null = null;
  shouldDamage = true;

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

  public renderEnemy(_: Player, __: CanvasRenderingContext2D): void {}

  public move(): void {}

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

  public takeDamage(damage: number) {
    if (this.shouldDamage) {
      this.health = this.health ? this.health - damage : 0;
    }
    if (!this.shouldDamage && !this.damageTimeout) {
      this.damageTimeout = setTimeout(() => {
        this.shouldDamage = true;
        this.damageTimeout = null;
      }, 400);
    }
  }

  public attackCharacter(_: Player): number {
    return 0;
  }

  public isAlive(): boolean {
    return !!this.health;
  }
}
