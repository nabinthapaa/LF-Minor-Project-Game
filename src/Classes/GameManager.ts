import { obstacleSprite } from "../constants/ObstacleSprite";
import { TILESET_COLUMNS, TILE_HEIGHT, TILE_WIDTH } from "../constants/Sprite";
import { EPlatform } from "../enums/Platform";
import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";
import {
  isCollisionBetween,
  resolveCollisionBetween,
  resolveHorizontalCollision,
  resolveVerticalCollision,
} from "../utils/Collision";
import { Obstacle } from "./Obstacle";
import Platform from "./Platform";
import { Player } from "./Player";
import { Beeto } from "./enemies/Beeto";
import BigDragon from "./enemies/BigDragon";
import { Enemy } from "./enemies/Enemy";

interface GameManagerConstructor {
  platforms: Platform[];
  player: Player;
  enemies: Enemy[];
  cameraPositionWorld: Position;
  obstacles: Obstacle[];
}

export default class GameManager {
  platforms: Platform[];
  player: Player;
  enemies: Enemy[];
  cameraPosition: Position = { x: 0, y: 0 };
  obstacles: Obstacle[];
  nearbyPlatforms: Platform[] = [];
  keySet = new Set<string>();
  bigDragonLastAttack = 0;

  constructor(
    {
      platforms,
      player,
      enemies,
      cameraPositionWorld,
      obstacles,
    }: GameManagerConstructor,
    public ctx: CanvasRenderingContext2D
  ) {
    this.platforms = platforms;
    this.player = player;
    this.enemies = enemies;
    this.cameraPosition = cameraPositionWorld;
    this.obstacles = obstacles;
  }

  public update(ctx: CanvasRenderingContext2D, MapData: number[][]): void {
    this.drawMap(ctx, MapData);
    // Update Phase
    this.updatePlatformsNearby();
    this.checkHorizontalPlatformCollision();
    this.player.updatePlayer();
    this.checkVerticalPlatformCollision();
    this.checkObstacleCollisions();
    this.checkPlayerEnemyCollision();
    // Draw Phase
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Beeto) enemy.move();
    });
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Beeto) enemy.renderEnemy(this.player, ctx);
      if (enemy instanceof BigDragon) enemy.update(this.player, ctx);
    });
    this.player.drawPlayer(ctx);
    this.drawObstacles(ctx);
  }

  public drawMap(ctx: CanvasRenderingContext2D, MapData: number[][]): void {
    if (!MapData) return;
    for (let y = 0; y < MapData.length; y++) {
      for (let x = 0; x < MapData[y].length; x++) {
        const tile = MapData[y][x];
        if (tile !== 403) {
          const xPos = x * TILE_WIDTH + this.cameraPosition.x;
          const yPos = y * TILE_HEIGHT;
          ctx.drawImage(
            tileset,
            (tile % TILESET_COLUMNS) * TILE_WIDTH,
            Math.floor(tile / TILESET_COLUMNS) * TILE_HEIGHT,
            TILE_WIDTH,
            TILE_HEIGHT,
            xPos,
            yPos,
            TILE_WIDTH,
            TILE_HEIGHT
          );
        }
      }
    }
  }

  public drawObstacles(ctx: CanvasRenderingContext2D): void {
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw(ctx, this.cameraPosition);
    });
  }

  public checkObstacleCollisions(): void {
    for (let i = 0; i < this.obstacles?.length; i++) {
      let obstacle = this.obstacles[i];
      if (Math.abs(obstacle.position.x - this.player.position.x) > 50) continue;
      if (obstacle.isColliding(this.player.asSolidObject)) {
        if (!this.player.isAttacking && !this.player.isJumpAttacking) {
          resolveCollisionBetween(this.player, obstacle.asSolidObject);
        }
        if (
          this.player.isJumpAttacking &&
          obstacle.isColliding(this.player.damageBox)
        ) {
          obstacle.switchSprite(obstacleSprite["bigDirtBlockBroken"]);
          obstacle.dimension.height = 0;
          obstacle.dimension.width = 0;
          obstacle.position = { x: 0, y: 0 };
          this.player.rebound();
          this.obstacles?.splice(i, 1);
        }
        if (
          this.player.isAttacking &&
          isCollisionBetween(this.player.damageBox, obstacle.asSolidObject)
        ) {
          obstacle.switchSprite(obstacleSprite["bigDirtBlockBroken"]);
          obstacle.dimension.height = 0;
          obstacle.dimension.width = 0;
          obstacle.position = { x: 0, y: 0 };
          this.obstacles?.splice(i, 1);
        }
      }
    }
  }

  private getNearbyEnemies = (): Enemy[] => {
    return this.enemies.filter((enemy) => {
      return (
        Math.abs(enemy.position.x - this.player.position.x) < 500 ||
        Math.abs(enemy.position.y - this.player.position.y) < 200
      );
    });
  };

  public checkPlayerEnemyCollision(): void {
    this.getNearbyEnemies().forEach((enemy, index) => {
      if (enemy.isAlive()) {
        if (enemy.isColliding(this.player.hitbox) && enemy instanceof Beeto) {
          this.handleBeetoAttack(enemy);
        } else if (
          Math.abs(enemy.position.x - this.player.position.x) < 500 &&
          enemy instanceof BigDragon
        ) {
          this.handleBigDragonAttack(enemy);
        }
      } else {
        this.enemies.splice(index, 1);
      }
    });
  }

  /**
   * Updates the nearby platforms that the player can collide with
   * @returns {void}
   */
  public updatePlatformsNearby(): void {
    this.nearbyPlatforms = this.platforms.filter((platform) =>
      isCollisionBetween(this.player.asSolidObject, platform)
    );
  }

  /**
   * Checks for vertical collision with the platform while jumping and falling
   * if player is falling and collides with the platform, the player is grounded
   * if player is jumping and collides with the platform, the player bounces back
   * the ground
   * @returns {void}
   */
  private checkVerticalPlatformCollision(): void {
    for (let platform of this.nearbyPlatforms) {
      if (isCollisionBetween(this.player.asSolidObject, platform)) {
        if (platform.type === EPlatform.COLLIDABLE)
          resolveVerticalCollision(this.player, platform);
        else if (platform.type === EPlatform.CLIMBABLE) {
          if (this.keySet.has("ArrowUp")) {
            this.player.position.y -= 1;
          } else if (this.keySet.has("ArrowDown")) {
            if (!this.player.isGrounded) this.player.position.y += 1;
          }
        } else if (platform.type === EPlatform.LETHAL) {
          console.log("Lethal Platform Collision");
          this.player.init();
        }
      }
    }
  }

  /**
   * Checks for horizontal collision with the platform while moving left and right
   * only if the platform is a wall, the player is stopped from moving
   * @returns {void}
   */
  private checkHorizontalPlatformCollision(): void {
    for (let platform of this.nearbyPlatforms) {
      if (isCollisionBetween(this.player.asSolidObject, platform)) {
        if (platform.isWall) {
          resolveHorizontalCollision(this.player, platform);
        }
        if (platform.type === EPlatform.LETHAL) {
          console.log("Lethal Platform Collision");
          this.player.init();
        }
      }
    }
  }

  /**
   * Handles the attack of the Beeto on enemy
   * @param enemy The enemy with which the player is close to 
   */
  private handleBeetoAttack(enemy: Beeto): void {
    if (
      this.player.isAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.asSolidObject)
    ) {
      enemy.takeDamage(50);
      enemy.shouldDamage = false;
    } else if (
      this.player.isJumpAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.asSolidObject)
    ) {
      enemy.takeDamage(100);
      enemy.shouldDamage = false;
      this.player.rebound();
    } else if (enemy.isColliding(this.player.asSolidObject)) {
      this.player.takeDamage(10);
      this.player.shouldDamage = false;
    }
  }

  /**
   * Handles the attack of the Big Dragon on enemy
   * @param enemy The enemy with which the player is close to 
   */
  private handleBigDragonAttack(enemy: BigDragon): void {
    if (
      this.player.isAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.hitbox)
    ) {
      enemy.takeDamage(50);
      enemy.shouldDamage = false;
    } else if (
      this.player.isJumpAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.hitbox)
    ) {
      enemy.takeDamage(100);
      this.player.rebound();
      enemy.shouldDamage = false;
    } else if (
      this.player.isJumpAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.noHitbox)
    ) {
      this.player.rebound();
    } else {
      if (this.bigDragonLastAttack === 0) {
        enemy.attackPlayer();
        enemy.isAttacking = true;
        this.bigDragonLastAttack = Date.now();
      } else {
        if (Date.now() - this.bigDragonLastAttack > 10000) {
          enemy.attackPlayer();
          this.bigDragonLastAttack = 0;
        }
      }
      if (Date.now() - this.bigDragonLastAttack > 1000) {
        enemy.isAttacking = false;
      }
    }
  }
}
