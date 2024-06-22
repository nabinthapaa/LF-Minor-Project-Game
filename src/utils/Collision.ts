import { SolidObject } from "../types/Position";

export function Collision(Object1: SolidObject, Object2: SolidObject) {
  return (
    Object1.x < Object2.x + Object2.width &&
    Object1.x + Object1.width > Object2.x &&
    Object1.y < Object2.y + Object2.height &&
    Object1.y + Object1.height > Object2.y
  );
}
