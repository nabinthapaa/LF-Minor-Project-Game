import { levelInfo } from "../LevelsData/Levels";
import { MAP } from "../constants/Canvas";
import { obstacleSprite } from "../constants/ObstacleSprite";
import { TILESET_COLUMNS, TILE_HEIGHT, TILE_WIDTH } from "../constants/Sprite";
import { EItem } from "../enums/Items";
import { EPlatform } from "../enums/Platform";
import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";
import {
  isCollisionBetween,
  resolveCollisionBetween,
  resolveHorizontalCollision,
  resolveVerticalCollision,
} from "../utils/Collision";
import Player from "./Player";
import Beeto from "./enemies/Beeto";
import BigDragon from "./enemies/BigDragon";
import Boss from "./enemies/Boss";
import { Enemy } from "./enemies/Enemy";
import Skeleton from "./enemies/Skeleton";
import DirtPile from "./objects/DirtPile";
import Item from "./objects/Item";
import { Obstacle } from "./objects/Obstacle";
import Platform from "./objects/Platform";

const items: EItem[] = [
  EItem.GOLD,
  EItem.DIAMOND,
  EItem.REDGEM,
  EItem.PURPLEGEM,
];

interface GameManagerConstructor {
  player: Player;
  cameraPositionWorld: Position;
}

export default class GameManager {
  player: Player;
  cameraPosition: Position = { x: 0, y: 0 };
  nearbyPlatforms: Platform[] = [];
  keySet = new Set<string>();
  bigDragonLastAttack = 0;
  currentLevel = 1;
  level = 1;
  maxLevel = 2;
  MapData: number[][] = levelInfo[`${this.level}`].map;
  platforms: Platform[] = levelInfo[`${this.level}`].platforms;
  obstacles: Obstacle[] = Object.create(levelInfo[`${this.level}`].obstacles);
  enemies: Enemy[] = Object.create(levelInfo[`${this.level}`].enemies);
  items: Item[] = [];
  dirtPiles: DirtPile[] = Object.create(levelInfo[`${this.level}`].dirtPiles);

  constructor(
    { player, cameraPositionWorld }: GameManagerConstructor,
    public ctx: CanvasRenderingContext2D
  ) {
    this.player = player;
    this.cameraPosition = cameraPositionWorld;
  }

  public init() {
    this.level = 1;
    this.currentLevel = 1;
    this.MapData = levelInfo[`${this.level}`].map;
    this.platforms = levelInfo[`${this.level}`].platforms;
    this.obstacles = levelInfo[`${this.level}`].obstacles.map(
      (obstacle) => obstacle
    );
    this.enemies = levelInfo[`${this.level}`].enemies.map((enemy) => enemy);
    this.items = [];
    this.player.init();
    this.player.health = 400;
    this.cameraPosition.x = 0;
    this.cameraPosition.y = 0;
  }

  public update(ctx: CanvasRenderingContext2D): void {
    //Check Current level
    this.updateLevel();
    if (this.currentLevel !== this.level) {
      this.handleLevelChange();
    }
    // Update Phase
    this.updatePlatformsNearby();
    this.checkHorizontalPlatformCollision();
    this.player.updatePlayer();
    this.checkVerticalPlatformCollision();
    this.checkObstacleCollisions();
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Beeto) enemy.move();
    });
    this.checkPlayerEnemyCollision();
    this.checkItemCollisions();
    this.checkDirtPileHit();
    // Draw Phase
    this.drawMap(ctx, this.MapData);
    this.player.drawPlayer(ctx);
    this.drawItems(ctx);
    this.drawDirtPile(ctx);
    this.enemies.forEach((enemy) => {
      enemy.update(this.player, ctx);
    });
    this.drawObstacles(ctx);
  }

  private updateLevel() {
    if (this.player.position.x > MAP.MAP_COLS * TILE_WIDTH - 100) {
      this.currentLevel++;
    }
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

  public dropItem(x: number, y: number, count: number = 3): void {
    for (let i = 0; i < count; i++) {
      let randomItem = items[Math.floor(Math.random() * items.length)];
      console.log(randomItem + " dropped");
      let x_pos = x + (Math.random() > 0.5 ? 10 : -10);
      this.items.push(new Item(x_pos, y, randomItem));
    }
  }

  public drawItems(ctx: CanvasRenderingContext2D): void {
    this.items.forEach((item) => {
      item.update(ctx);
    });
  }

  public checkItemCollisions(): void {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.isColldingWithPlayer(this.player.hitbox)) {
        if (!item.isMoving) {
          this.player.collectItem(item.type);
          this.items.splice(i, 1);
        }
      }
    }
  }

  public drawDirtPile(ctx: CanvasRenderingContext2D): void {
    this.dirtPiles.forEach((dirtPile) => {
      dirtPile.update(ctx);
    });
  }

  public checkDirtPileHit(): void {
    for (let i = 0; i < this.dirtPiles.length; i++) {
      let dirtPile = this.dirtPiles[i];
      if (dirtPile.isColldingWithPlayer(this.player.asSolidObject)) {
        if (this.player.isAttacking) {
          dirtPile.takeDamage(30);
          if (dirtPile.health <= 0) {
            this.dropItem(dirtPile.x, dirtPile.y + dirtPile.height - 10);
            this.dirtPiles.splice(i, 1);
          }
        }
      }
    }
  }

  public drawPlatforms(ctx: CanvasRenderingContext2D): void {
    this.platforms.forEach((platform) => {
      platform.draw(ctx);
    });
  }

  public drawObstacles(ctx: CanvasRenderingContext2D): void {
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw(ctx, this.cameraPosition);
    });
  }

  public checkObstacleCollisions(): void {
    for (let i = 0; i < this.obstacles.length; i++) {
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
          resolveVerticalCollision(this.player, obstacle.asSolidObject);
          this.player.rebound();
          this.dropItem(
            obstacle.position.x,
            obstacle.position.y + obstacle.dimension.height - 10
          );
          this.obstacles.splice(i, 1);
        }
        if (
          this.player.isAttacking &&
          obstacle.isColliding(this.player.damageBox)
        ) {
          this.dropItem(
            obstacle.position.x,
            obstacle.position.y + obstacle.dimension.height - 10
          );
          this.obstacles.splice(i, 1);
        }
      }
    }
  }

  private handleLevelChange(): void {
    if (this.currentLevel > this.maxLevel) return;
    this.level = this.currentLevel;
    this.MapData = levelInfo[`${this.level}`].map;
    this.platforms = levelInfo[`${this.level}`].platforms;
    this.obstacles = levelInfo[`${this.level}`].obstacles.map(
      (obstacle) => obstacle
    );
    this.enemies = levelInfo[`${this.level}`].enemies.map((enemy) => enemy);
    this.items = [];
    this.player.init();
    this.player.health = 400;
    this.cameraPosition.x = 0;
    this.cameraPosition.y = 0;
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
          Math.abs(enemy.position.x - this.player.position.x) < 1000 &&
          enemy instanceof BigDragon
        ) {
          enemy.move();
          if (Math.abs(enemy.position.x - this.player.position.x) < 500)
            this.handleBigDragonAttack(enemy);
        } else if (enemy instanceof Skeleton) {
          enemy.move();
          if (enemy.isColliding(this.player.hitbox)) {
            Math.abs(enemy.position.x - this.player.position.x) < 1000 &&
              this.handleSkeletonAttack(enemy);
          } else {
            enemy.isAttacking = false;
          }
        } else if (enemy instanceof Boss) {
          if (Math.abs(enemy.position.x - this.player.position.x) < 1000) {
            enemy.moveBoss(this.player);
            this.handleBossAttack(enemy, this.player);
          } else {
            this.handleBossAttack(enemy, this.player);
          }
        }
      } else {
        if (enemy instanceof Beeto)
          this.dropItem(
            enemy.position.x,
            enemy.position.y + enemy.dimension.height - 10
          );
        if (enemy instanceof BigDragon)
          this.dropItem(
            enemy.position.x,
            enemy.position.y + enemy.dimension.height - 10,
            6
          );
        if (enemy instanceof Skeleton)
          this.dropItem(
            enemy.position.x,
            enemy.position.y + enemy.dimension.height - 10,
            4
          );
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
    if (this.handlePlayerAttackOnEnemy(enemy)) {
      return;
    } else if (enemy.isColliding(this.player.asSolidObject)) {
      this.player.takeDamage(10);
      this.player.isInvincible = false;
    }
  }

  /**
   * Handles the attack of the Big Dragon on enemy
   * @param enemy The enemy with which the player is close to
   */
  private handleBigDragonAttack(enemy: BigDragon): void {
    if (this.handlePlayerAttackOnEnemy(enemy)) {
      return;
    } else {
      if (this.bigDragonLastAttack === 0) {
        enemy.attackPlayer();
        enemy.isAttacking = true;
        this.bigDragonLastAttack = Date.now();
      } else {
        if (Date.now() - this.bigDragonLastAttack > 5000) {
          enemy.attackPlayer();
          this.bigDragonLastAttack = 0;
        }
      }
      if (Date.now() - this.bigDragonLastAttack > 1000) {
        enemy.isAttacking = false;
      }
    }
  }

  private handleSkeletonAttack(enemy: Skeleton): void {
    if (this.handlePlayerAttackOnEnemy(enemy)) {
      return;
    } else if (isCollisionBetween(this.player.hitbox, enemy.asSolidObject)) {
      if (enemy.lastAttack === 0) {
        enemy.attackPlayer();
        enemy.isAttacking = true;
        enemy.shouldFlip = !this.player.shouldFlip;
        this.player.takeDamage(100);
        enemy.lastAttack = Date.now();
      } else {
        if (Date.now() - enemy.lastAttack > 2000) {
          enemy.attackPlayer();
          this.bigDragonLastAttack = 0;
        }
      }
      if (Date.now() - enemy.lastAttack > 500) {
        enemy.isAttacking = false;
      }
    }
  }

  private handleBossAttack(enemy: Boss, player: Player): void {
    if (this.handlePlayerAttackOnEnemy(enemy)) {
      return;
    } else if (isCollisionBetween(this.player.hitbox, enemy.asSolidObject)) {
      if (enemy.lastAttack === 0 || !enemy.isInvincible) {
        enemy.attackPlayer(player);
        if (enemy.isAttacking) this.player.takeDamage(100);
        if (enemy.isJumpAttacking) this.player.takeDamage(200);
        player.isInvincible = false;
        enemy.shouldFlip = !this.player.shouldFlip;
        enemy.lastAttackTime = Date.now();
      } else {
        if (Date.now() - enemy.lastAttack > 2000) {
          enemy.attackPlayer(player);
          enemy.lastAttackTime = 0;
        }
      }
      if (Date.now() - enemy.lastAttack > 500) {
        enemy.isAttacking = false;
        enemy.isJumpAttacking = false;
      }
    }
  }

  private handlePlayerAttackOnEnemy(enemy: Enemy): boolean {
    if (
      this.player.isAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.asSolidObject)
    ) {
      enemy.takeDamage(50);
      enemy.shouldDamage = false;
      return true;
    } else if (
      this.player.isJumpAttacking &&
      isCollisionBetween(this.player.damageBox, enemy.asSolidObject)
    ) {
      enemy.takeDamage(100);
      this.player.rebound();
      enemy.shouldDamage = false;
      return true;
    }
    return false;
  }
}
