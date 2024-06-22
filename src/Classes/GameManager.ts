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
import { Enemy } from "./Enemy";
import { Obstacle } from "./Obstacle";
import Platform from "./Platform";
import { Player } from "./Player";

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
  obstacles?: Obstacle[];
  nearbyPlatforms: Platform[] = [];
  keySet = new Set<string>();

  constructor({
    platforms,
    player,
    enemies,
    cameraPositionWorld,
    obstacles,
  }: GameManagerConstructor) {
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
      enemy.move();
      enemy.renderEnemy(ctx);
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
    this.obstacles?.forEach((obstacle) => {
      if (obstacle.isColliding(this.player.asSolidObject)) {
        if (!this.player.isAttacking && !this.player.isJumpAttacking) {
          resolveCollisionBetween(this.player, obstacle.asSolidObject);
        } else if (this.player.isJumpAttacking) {
          obstacle.switchSprite(obstacleSprite["bigDirtBlockBroken"]);
          this.player.rebound();
          obstacle.dimension.height = 0;
          obstacle.dimension.width = 0;
          obstacle.position = { x: 0, y: 0 };
        } else {
          obstacle.switchSprite(obstacleSprite["bigDirtBlockBroken"]);
          obstacle.dimension.height = 0;
          obstacle.dimension.width = 0;
          obstacle.position = { x: 0, y: 0 };
        }
      }
    });
  }

  public checkPlayerEnemyCollision(): void {
    this.enemies.forEach((enemy) => {
      if (enemy.isColliding(this.player.asSolidObject)) {
        if (this.player.isAttacking) {
          enemy.takeDamage(1);
        }
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
            this.player.position.y += 1;
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

  public checkPlayerAttack(): void {}
  public checkPlayerDamage(): void {}

  public checkEnemyAttack(): void {}
  public checkEnemyDamage(): void {}
}
