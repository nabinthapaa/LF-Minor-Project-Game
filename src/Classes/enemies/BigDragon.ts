import { Position } from "../../types/Position";
import { Enemy } from "./Enemy";

export default class BigDragon extends Enemy {
  constructor(public cameraPosition: Position, public position: Position) {
    super(cameraPosition, position);
    this.health = 600;
  }
}
