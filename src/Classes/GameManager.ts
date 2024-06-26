import { levelInfo } from "../LevelsData/Levels";
import { MAP } from "../constants/Canvas";
import { MAX_LEVEL } from "../constants/Game";
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
  maxLevel = MAX_LEVEL;
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

  /**
   * Initializes the game state
   * Sets the level to 1
   * Resets Player, Camera Position, MapData, Platforms, Obstacles, Enemies, DirtPiles, Items
   * @returns {void}
   */
  public init() {
    this.level = 1;
    this.currentLevel = 1;
    this.MapData = levelInfo[`${this.level}`].map;
    this.platforms = levelInfo[`${this.level}`].platforms;
    this.obstacles = levelInfo[`${this.level}`].obstacles.map(
      (obstacle) => obstacle
    );
    this.enemies = levelInfo[`${this.level}`].enemies.map((enemy) => enemy);
    this.dirtPiles = levelInfo[`${this.level}`].dirtPiles.map((pile) => pile);
    this.items = [];
    this.player.init();
    this.player.health = 400;
    this.cameraPosition.x = 0;
    this.cameraPosition.y = 0;
  }

  /**
   * Updates the game state
   * Checks player and other objects, enemies, items, platforms collision
   * and updates the game state accordingly
   * @param ctx {CanvasRenderingContext2D} The canvas context to draw the game
   * @returns {void}
   */
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

  /**
   * Changes current level to the next level when player reaches
   * at certain position on the Map
   * @returns {void}
   */
  private updateLevel() {
    if (this.player.position.x > MAP.MAP_COLS * TILE_WIDTH - 100) {
      this.currentLevel++;
    }
  }

  /**
   * Draws the map on the screen based on the 2D Matrix passed to it
   * @param ctx   {CanvasRenderingContext2D} The canvas context to draw the map
   * @param MapData  {number[][]} The map data to draw the map on the screen
   * @returns  {void}
   */
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

  /**
   *  Drops the gems on the screen
   * @param x {number} The x position where the gems is dropped
   * @param y {number} The y position where the gems is dropped
   * @param count   {number} The number of gems to be dropped
   * @returns {void}
   */
  public dropItem(x: number, y: number, count: number = 3): void {
    for (let i = 0; i < count; i++) {
      let randomItem = items[Math.floor(Math.random() * items.length)];
      let x_pos = x + (Math.random() > 0.5 ? 10 : -10);
      this.items.push(new Item(x_pos, y, randomItem));
    }
  }

  /**
   *  Renders the items on the screen
   * @param ctx - Canvas context to render the items
   */
  public drawItems(ctx: CanvasRenderingContext2D): void {
    this.items.forEach((item) => {
      item.update(ctx);
    });
  }

  /**
   * Checks for collision between player and nearby items
   * If the player is colliding with the item, the player collects the item
   * @returns {void}
   */
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

  /**
   *  Renders the dirt piles on the screen
   * @param ctx - Canvas context to render the dirt piles
   * @returns {void}
   */
  public drawDirtPile(ctx: CanvasRenderingContext2D): void {
    this.dirtPiles.forEach((dirtPile) => {
      dirtPile.update(ctx);
    });
  }

  /**
   * Checks for collision between player and nearby dirt piles
   * If player is attacking, the dirt pile is destroyed gradually
   * When destroyed some gems are dropped
   * @returns {void}
   */
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

  /**
   *  Renders the platforms on the screen
   * @param ctx - Canvas context to render the platforms
   * @returns {void}
   */
  public drawPlatforms(ctx: CanvasRenderingContext2D): void {
    this.platforms.forEach((platform) => {
      platform.draw(ctx);
    });
  }

  /**
   * Renders the obstacles on the screen
   * @param ctx - Canvas context to render the obstacles
   * @returns {void}
   */
  public drawObstacles(ctx: CanvasRenderingContext2D): void {
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw(ctx, this.cameraPosition);
    });
  }

  /**
   * Checks for collision between player and nearby obstacles
   * If player is not attacking, the player is stopped from moving
   * If player is attacking, the obstacle is destroyed
   * When destroyed some gems are dropped
   * @returns {void}
   */
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
    this.dirtPiles = levelInfo[`${this.level}`].dirtPiles.map((pile) => pile);
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

  /**
   * Checks for collision between player and nearby enemies
   * When enemy dies they drop some gems
   * @returns {void}
   */
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
   * @returns {void}
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

  /**
   * Handles the attack of the Skeleton on Player
   * @param enemy
   * @returns {void}
   */
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

  /**
   * Check if the player is attacking the enemy or not
   * returns a boolean based on it
   * @param enemy
   * @returns {boolean}
   */
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
