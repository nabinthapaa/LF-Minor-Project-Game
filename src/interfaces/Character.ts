import { CharacterVariant } from "../enums/Character";
import { TAttack } from "../types/Character";
import { Dimension, Position } from "../types/Position";

export interface ICharacter {
  type: CharacterVariant;
  health?: number;
  attack?: TAttack[];
  position: Position;
  dimension: Dimension; 

  attackCharacter?(character: ICharacter): number;
  takeDamage?(damage: number): void;
  isDead?(): boolean;
}
