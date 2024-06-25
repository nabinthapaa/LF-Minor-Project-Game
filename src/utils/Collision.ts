import Player from "../Classes/Player";
import { SolidObject } from "../types/Position";

/**
 * Check if two objects are colliding using AABB collision detection
 * @param Object1 - Any rectangular object
 * @param Object2 - Any rectangular object
 * @returns {boolean} - Returns true if the two objects are colliding
 */
export function isCollisionBetween(
  Object1: SolidObject,
  Object2: SolidObject
): boolean {
  return (
    Object1.x < Object2.x + Object2.width &&
    Object1.x + Object1.width > Object2.x &&
    Object1.y < Object2.y + Object2.height &&
    Object1.y + Object1.height > Object2.y
  );
}

export function resolveCollisionBetween(object1: Player, object2: SolidObject) {
  let dx: number;
  let dy: number;

  if (object1.hitbox.x < object2.x) {
    dx = object1.hitbox.x + object1.hitbox.width - object2.x;
  } else {
    dx = object2.x + object2.width - object1.hitbox.x;
  }

  if (object1.hitbox.y < object2.y) {
    dy = object1.hitbox.y + object1.hitbox.height - object2.y;
  } else {
    dy = object2.y + object2.height - object1.hitbox.y;
  }

  if (dx < dy) {
    resolveHorizontalCollision(object1, object2);
  } else {
    resolveVerticalCollision(object1, object2);
  }
}

/**
 * Resolve the vertical collision between player and solid object
 * @param object1 - Player
 * @param object2 - Solid Object may be platform or obstacle
 */
export function resolveVerticalCollision(
  object1: Player,
  object2: SolidObject
) {
  if (object1.velocity.y >= 0) {
    object1.position.y = object2.y - object1.dimension.height;
    object1.velocity.y = 0;
    object1.isGrounded = true;
  }
  if (object1.velocity.y < 0) {
    object1.position.y = object2.y + object2.height;
    object1.velocity.y = 0;
  }
}

/**
 * Resolve the horizontal collision between player and solid object
 * @param object1 - Player
 * @param object2 - Solid Object may be platform or obstacle
 */
export function resolveHorizontalCollision(
  object1: Player,
  object2: SolidObject
) {
  if (
    object1.position.x + object1.dimension.width > object2.x &&
    object1.position.x + object1.dimension.width < object2.x + object2.width
  ) {
    object1.position.x = object2.x - object1.dimension.width;
    object1.velocity.x = 0;
  } else if (
    object1.position.x > object2.x &&
    object1.position.x < object2.x + object2.width
  ) {
    object1.position.x = object2.x + object2.width;
    object1.velocity.x = 0;
  }
}
