import { Canvas } from "../constants/Canvas";
import {
  GRAVITY,
  JUMP_FORCE,
  PLAYER_X_SPEED,
  PLAYER_Y_SPEED,
} from "../constants/Character";
import { TILE_WIDTH } from "../constants/Sprite";
import { PlayerSpriteDimensions } from "../constants/SpriteDimensions";
import { AttackVariant } from "../enums/Attack";
import { CharacterVariant } from "../enums/Character";
import { TVelocity } from "../types/Character";
import { Dimension, Position, SolidObject } from "../types/Position";
import { Collision } from "../utils/Collision";
import { Character } from "./Character";
import Platform from "./Platform";
import { SpriteRender } from "./SpriteRenderer";

export class Player extends Character {
  position: Position = {
    x: 0,
    y: 0,
  };
  dimension: Dimension;
  velocity: TVelocity;
  sprite = "shine";
  isSpirteReset = false;
  currentSpiriteState = "shine";
  isGrounded = false;
  importantAnimationPlaying = false;
  isAttacking = false;
  facingDirection = "right";
  health = 400;
  hitbox = {
    x: this.position.x,
    y: this.position.y,
    width: 36,
    height: 32,
  };

  nearbyPlatforms: Platform[] = [];
  render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);

  constructor(public platforms: Platform[], public cameraPosition_: Position) {
    super(CharacterVariant.PLAYER, 400, [
      { name: AttackVariant.NORMAL, damage: 100 },
      { name: AttackVariant.JUMP, damage: 200 },
    ]);
    this.dimension = {
      width: PlayerSpriteDimensions[this.sprite].frameWidth,
      height: PlayerSpriteDimensions[this.sprite].frameHeight,
    };
    this.velocity = { x: PLAYER_X_SPEED, y: PLAYER_Y_SPEED };
  }

  private init() {
    this.render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);
    this.position = {
      x: 0,
      y: 0,
    };
    this.cameraPosition_.x = 0;
    this.cameraPosition_.y = 0;
  }

  public updatePlayer(ctx: CanvasRenderingContext2D) {
    this.isGrounded = false;
    this.updateNearbyAvailalePlatforms();
    this.updateHitBox();
    this.checkCanvasHorizontalEdgeCollision();
    this.checkHorizontalPlatformCollision();
    this.applyGravity();
    this.updateHitBox();
    this.checkVerticalPlatformCollision();
    this.drawPlayer(ctx);
  }

  // TODO: Remove this function
  drawplayerboundry(ctx: CanvasRenderingContext2D) {
    console.log("Player Positions", { x: this.position.x, y: this.position.y });
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.position.x + this.cameraPosition_.x,
      this.position.y,
      36,
      32
    );
  }

  /**
   * Draws the player on the canvas by using the sprite renderer and flips the player
   * based on the direction the player is facing
   * @param ctx {CanvasRenderingContext2D} - The canvas context to draw the player
   */
  public drawPlayer(ctx: CanvasRenderingContext2D) {
    this.render.animateSprite(this);
    if (this.facingDirection === "right") {
      this.render.drawFrame(
        ctx,
        this.position,
        this.dimension,
        false,
        this.cameraPosition_
      );
    } else {
      this.render.drawFrame(
        ctx,
        this.position,
        this.dimension,
        true,
        this.cameraPosition_
      );
    }
  }

  /**
   * Moves the player left using an constant player
   * speed defined in constants/Character.ts
   * @returns {void}
   */
  public moveLeft(): void {
    this.velocity.x = -PLAYER_X_SPEED;
    this.position.x += this.velocity.x;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.facingDirection = "left";
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  /**
   * Moves the player right using an constant player
   * speed defined in constants/Character.ts
   * @returns {void}
   */
  public moveRight(): void {
    this.velocity.x = PLAYER_X_SPEED;
    this.position.x += this.velocity.x;
    if (!this.isGrounded) return;
    this.facingDirection = "right";
    this.sprite = "walk";
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  /**
   * Reset the player sprite to idle sprite if
   * the player is not moving or attacking and is on the ground
   * @returns {void}
   */
  public resetSprite(): void {
    if (!this.isGrounded || this.importantAnimationPlaying) return;
    this.sprite = "shine";
    if (!this.isSpirteReset) {
      this.switchSprite();
      this.isSpirteReset = true;
      this.currentSpiriteState = this.sprite;
    }
  }

  /**
   * Excutes player jump action only when the player is on ground
   * and sets the player sprite to jump sprite
   * @returns {void}
   */
  public jump(): void {
    if (this.isGrounded) {
      this.velocity.y = JUMP_FORCE;
      this.position.y += this.velocity.y;
      this.sprite = "jump";
      if (this.currentSpiriteState !== this.sprite) {
        this.switchSprite();
        this.currentSpiriteState = this.sprite;
      }
      this.isGrounded = false;
    }
  }

  /**
   * Excutes player jump attack action only when the player is jumping
   * and sets the player sprite to jump attack sprite
   * @returns {void}
   */
  public jumpAttack(): void {
    if (!this.isGrounded) {
      this.sprite = "jumpAttack";
      if (this.currentSpiriteState !== this.sprite) {
        this.switchSprite();
        this.currentSpiriteState = this.sprite;
      }
    }
  }

  /**
   * Normal attack action only when the player is on ground
   * @returns {void}
   */
  public attackNormal(): void {
    if (!this.isGrounded || this.isAttacking) return;
    this.sprite = "dig";
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
    this.importantAnimationPlaying = true;
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  /**
   * Decrease the health of the player by the damage amount
   * @param damage {number}
   * @returns {void}
   */
  public takeDamage(damage: number): void {
    this.health = this.health ? this.health - damage : 0;
  }

  /**
   * Returns a boolean value specifying if the player is alive
   * @returns {boolean}
   */
  public isAlive(): boolean {
    return !!this.health;
  }

  /**
   * Returns a solid object version of the player player class for
   * collision detection
   * @returns SolidObject
   */
  public getSolidVersionofPlayer(): SolidObject {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimension.width,
      height: this.dimension.height,
    };
  }

  /**
   * Updates the nearby platforms that the player can collide with
   * @returns {void}
   */
  private updateNearbyAvailalePlatforms(): void {
    this.nearbyPlatforms = this.platforms.filter((platform) =>
      Collision(this.getSolidVersionofPlayer(), platform)
    );
  }

  /**
   * Updates the hitbox of the player
   * @returns {void}
   */
  private updateHitBox(): void {
    this.hitbox = {
      x: this.position.x,
      y: this.position.y,
      width: 36,
      height: this.dimension.height,
    };
  }

  /**
   * Switches the player sprite based on the sprite name
   * and sets the dimension of the player based on the sprite
   * @returns {void}
   */
  private switchSprite(): void {
    let spriteToSwitch = PlayerSpriteDimensions[this.sprite];
    this.render.switchSprite(spriteToSwitch);
    this.dimension = {
      width: spriteToSwitch.frameWidth,
      height: spriteToSwitch.frameHeight,
    };
    this.isSpirteReset = false;
  }

  private applyGravity(): void {
    if (this.isGrounded) return;
    this.velocity.y += GRAVITY;
    this.position.y += this.velocity.y;
    if (this.position.y >= Canvas.CANVAS_HEIGHT - this.dimension.height) {
      this.init();
    }
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
      if (Collision(this.getSolidVersionofPlayer(), platform)) {
        if (this.velocity.y >= 0) {
          this.position.y = platform.y - this.dimension.height;
          this.velocity.y = 0;
          this.isGrounded = true;
        }
        if (this.velocity.y < 0) {
          this.position.y = platform.y + platform.height;
          this.velocity.y = 0;
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
      if (Collision(this.getSolidVersionofPlayer(), platform)) {
        if (platform.isWall) {
          if (
            this.position.x + this.dimension.width > platform.x &&
            this.position.x + this.dimension.width < platform.x + platform.width
          ) {
            this.position.x = platform.x - this.dimension.width;
            this.velocity.x = 0;
            continue;
          } else if (
            this.position.x > platform.x &&
            this.position.x < platform.x + platform.width
          ) {
            this.position.x = platform.x + platform.width;
            this.velocity.x = 0;
            continue;
          }
        }
      }
    }
  }

  /**
   * Checks for horizontal collision with the canvas edge
   * if the player is at the edge of the canvas, the player is stopped from moving
   * @returns {void}
   */
  private checkCanvasHorizontalEdgeCollision(): void {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.dimension.width >= 200 * 16) {
      this.position.x = Canvas.CANVAS_WIDTH - this.dimension.width;
    }
  }
}
