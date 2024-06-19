import { AttackVariant } from "../enums/Attack";
import { CharacterVariant } from "../enums/Character";
import { Character } from "./Character";

export class NPC extends Character {
  constructor() {
    super(CharacterVariant.NPC, 0, [{ name: AttackVariant.NPC, damage: 0 }]);
  }

  public attackCharacter(): number {
    return 0;
  }

  public takeDamage(): void {
    return;
  }

  public isDead(): boolean {
    return false;
  }
}
