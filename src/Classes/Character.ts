import { CharacterVariant } from "../enums/Character";
import { ICharacter } from "../interfaces/Character";
import { TAttack, TVelocity } from "../types/Character";
import { Dimension, Position } from "../types/Position";

export class Character implements ICharacter {
  type: CharacterVariant;
  health?: number;
  attack?: TAttack[];
  position: Position;
  dimension: Dimension;
  velocity: TVelocity;

  constructor(
    type: CharacterVariant,
    health?: number,
    attack?: TAttack[],
    velocity?: TVelocity
  ) {
    this.type = type;
    this.health = health;
    this.attack = attack;
    this.position = { x: 0, y: 0 };
    this.dimension = { width: 0, height: 0 };
    this.velocity = velocity || { x: 0, y: 0 };
  }

  attackCharacter?(character: ICharacter): number {
    console.log(character);
    throw new Error("Method not implemented.");
  }
  takeDamage?(damage: number): void {
    console.log(damage);
    throw new Error("Method not implemented.");
  }
  isAlive?(): boolean {
    throw new Error("Method not implemented.");
  }
}
