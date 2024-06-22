import { TILESET_COLUMNS, TILE_HEIGHT, TILE_WIDTH } from "../constants/Sprite";
import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";
import { Enemy } from "./Enemy";
import Platform from "./Platform";
import { Player } from "./Player";

interface GameManagerConstructor {
  platforms: Platform[];
  player: Player;
  enemies: Enemy[];
  cameraPositionWorld: Position;
}

export default class GameManager {
  platforms: Platform[];
  player: Player;
  enemies: Enemy[];
  cameraPosition: Position = { x: 0, y: 0 };

  constructor({
    platforms,
    player,
    enemies,
    cameraPositionWorld,
  }: GameManagerConstructor) {
    this.platforms = platforms;
    this.player = player;
    this.enemies = enemies;
    this.cameraPosition = cameraPositionWorld;
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
  public checkCollisions(): void {}
  public checkPlayerEnemyCollision(): void {
    this.enemies.forEach((enemy) => {
      if (enemy.isColliding(this.player.getSolidVersionofPlayer())) {
        if (this.player.isAttacking) {
          enemy.takeDamage(1);
        }
      }
    });
  }
  public update(): void {}

  public checkPlayerAttack(): void {}
  public checkPlayerDamage(): void {}

  public checkEnemyAttack(): void {}
  public checkEnemyDamage(): void {}
}
