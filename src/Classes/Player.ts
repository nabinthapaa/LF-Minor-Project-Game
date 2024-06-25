import { Canvas, MAP } from "../constants/Canvas";
import {
  GRAVITY,
  JUMP_FORCE,
  PLAYER_X_SPEED,
  PLAYER_Y_SPEED,
} from "../constants/Character";
import { TILE_HEIGHT } from "../constants/Sprite";
import { PlayerSpriteDimensions } from "../constants/SpriteDimensions";
import { AttackVariant } from "../enums/Attack";
import { CharacterVariant } from "../enums/Character";
import { EItem } from "../enums/Items";
import { TVelocity } from "../types/Character";
import { Dimension, Position, SolidObject } from "../types/Position";
import { Character } from "./Character";
import { SpriteRender } from "./SpriteRenderer";

/**
 * Player class that is used for making a playable
 * character in the game
 * @extends {Character}
 */
export default class Player extends Character {
  position: Position = {
    x: 0,
    y: 0,
  };
  hitbox = {
    x: this.position.x,
    y: this.position.y,
    width: 36,
    height: 32,
  };
  damageBox = {
    x: this.position.x,
    y: this.position.y,
    width: 0,
    height: 0,
  };

  dimension: Dimension;
  velocity: TVelocity;
  sprite = "idle";
  currentSpiriteState = "idle";

  isSpirteReset = false;
  isGrounded = false;
  importantAnimationPlaying = false;
  isAttacking = false;
  isJumpAttacking = false;
  shouldFlip = false;
  isInvincible = true;
  damageTimeout: ReturnType<typeof setTimeout> | null = null;

  health = 400;
  gold = 0;
  render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);
  maxHealth: number = 400;

  constructor(public cameraPosition: Position) {
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

  /**
   * Initializes the player with default values
   * @returns {void}
   */
  public init(): void {
    this.render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);
    this.position = {
      x: 0,
      y: 0,
    };
    this.cameraPosition.x = 0;
    this.cameraPosition.y = 0;
    this.health = 400;
    this.isGrounded = false;
    this.isSpirteReset = false;
    this.isGrounded = false;
    this.importantAnimationPlaying = false;
    this.isAttacking = false;
    this.isJumpAttacking = false;
    this.shouldFlip = false;
    this.isInvincible = false;
  }

  /**
   * Updates the player position, hitbox, damage box and applies gravity
   * to the player
   * @returns {void}
   */
  public updatePlayer(): void {
    this.checkCanvasHorizontalEdgeCollision();
    this.applyGravity();
    this.addDamageBox();
    this.updateHitBox();
  }

  /**
   * Draws the player on the canvas by using the sprite renderer and flips the player
   * based on the direction the player is facing
   * @param ctx {CanvasRenderingContext2D} - The canvas context to draw the player
   * @returns {void}
   */
  public drawPlayer(ctx: CanvasRenderingContext2D): void {
    this.render.animateSprite(this);
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition
    );
  }

  /**
   * Reset the player sprite to idle sprite if
   * the player is not moving or attacking and is on the ground
   * @returns {void}
   */
  public resetSprite(): void {
    if (
      !this.isGrounded ||
      this.importantAnimationPlaying ||
      this.isSpirteReset
    )
      return;
    this.sprite = "idle";
    this.switchSprite();
    this.isSpirteReset = true;
    this.currentSpiriteState = this.sprite;
    this.isAttacking = false;
    this.isJumpAttacking = false;
    this.applyGravity();
  }

  /**
   * Moves the player left using an constant player
   * speed defined in constants/Character.ts
   * @returns {void}
   */
  public moveLeft(): void {
    this.velocity.x = -PLAYER_X_SPEED;
    this.position.x += this.velocity.x;
    this.shouldFlip = true;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.switchSprite();
    this.isGrounded = false;
  }

  /**
   * Moves the player right using an constant player
   * speed defined in constants/Character.ts
   * @returns {void}
   */
  public moveRight(): void {
    this.velocity.x = PLAYER_X_SPEED;
    this.position.x += this.velocity.x;
    this.shouldFlip = false;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.switchSprite();
    this.isGrounded = false;
  }

  /**
   * Excutes player jump action only when the player is on ground
   * and sets the player sprite to jump sprite
   * @returns {void}
   */
  public jump(): void {
    if (!this.isGrounded) return;
    this.isGrounded = false;
    this.velocity.y = JUMP_FORCE;
    this.position.y += this.velocity.y;
    this.sprite = "jump";
    this.switchSprite();
  }

  /**
   * Excutes player jump attack action only when the player is jumping
   * and sets the player sprite to jump attack sprite
   * @returns {void}
   */
  public jumpAttack(): void {
    if (this.isGrounded || this.isAttacking) return;
    this.sprite = "jumpAttack";
    this.isJumpAttacking = true;
    this.switchSprite();
    setTimeout(() => {
      this.resetDamageBox();
    }, 1000);
  }

  /**
   * Sends player back to jump attack state after colliding with
   * enemy or obstacle during a jump attack
   * @returns {void}
   */
  public rebound(): void {
    this.isAttacking = false;
    this.isGrounded = true;
    this.jump();
    this.jumpAttack();
  }

  /**
   * Normal attack action only when the player is on ground or air
   * @returns {void}
   */
  public attackNormal(): void {
    if (this.isAttacking || this.isJumpAttacking) return;
    if (this.shouldFlip) this.position.x -= 10;
    this.sprite = "dig";
    this.isAttacking = true;
    this.importantAnimationPlaying = true;
    this.switchSprite();
    setTimeout(() => {
      if (this.shouldFlip) this.position.x += 10;
      this.isAttacking = false;
      this.resetDamageBox();
    }, 500);
  }

  /**
   * Decrease the health of the player by the damage amount
   * @param damage {number}
   * @returns {void}
   */
  public takeDamage(damage: number): void {
    if (this.isInvincible) {
      this.health = this.health > 0 ? this.health - damage : 0;
      if (!this.isAlive()) {
        this.init();
      }
    }

    if (!this.isInvincible && !this.damageTimeout) {
      this.damageTimeout = setTimeout(() => {
        this.isInvincible = true;
        this.damageTimeout = null;
      }, 1000);
    }
  }

  /**
   * Returns a boolean value specifying if the player is alive
   * @returns {boolean}
   */
  public isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Collects the item and increases the gold of the player
   * based on the item collected
   * @param item {EItem}
   * @returns {void}
   */
  public collectItem(item: EItem): void {
    switch (item) {
      case EItem.GOLD:
        this.gold += 50;
        break;
      case EItem.DIAMOND:
        this.gold += 120;
        break;
      case EItem.REDGEM:
        if (this.health < this.maxHealth) {
          this.health += 50;
          if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
          }
        }
        break;
      case EItem.PURPLEGEM:
        this.gold += 200;
        break;
      default:
        break;
    }
  }

  /**
   * Returns a solid object version of the player player class for
   * collision detection
   * @returns SolidObject
   */
  get asSolidObject(): SolidObject {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimension.width,
      height: this.dimension.height,
    };
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
    if (this.currentSpiriteState === this.sprite) return;
    this.currentSpiriteState = this.sprite;
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
    if (this.position.y >= Canvas.COLS * TILE_HEIGHT - this.dimension.height) {
      this.init();
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
    } else if (
      this.position.x + this.dimension.width >=
      MAP.MAP_COLS * MAP.TILE_WIDTH
    ) {
      this.position.x = MAP.MAP_COLS * MAP.TILE_WIDTH - this.dimension.width;
    }
  }

  /**
   * Adds a damage box to the player when the player is attacking
   * Normal Attack: to the left or right of the player
   * Jump Attack: below the player
   * @returns {void}
   */
  private addDamageBox(): void {
    if (this.isAttacking) {
      this.damageBox = {
        x: this.shouldFlip
          ? this.position.x - this.hitbox.width / 4
          : this.position.x + this.hitbox.width,
        y: this.position.y + this.hitbox.height / 2,
        width: this.hitbox.width / 4,
        height: this.hitbox.height / 4,
      };
    }
    if (this.isJumpAttacking) {
      this.damageBox = {
        x: this.position.x + this.hitbox.width / 2 - this.hitbox.width / 4,
        y: this.position.y + this.hitbox.height,
        width: this.hitbox.width / 4,
        height: this.hitbox.height / 4,
      };
    }
  }

  /**
   * Resets the damage box of the player
   * when the player is not attacking
   * @returns {void}
   */
  private resetDamageBox(): void {
    this.damageBox = {
      x: this.position.x,
      y: this.position.y,
      width: 0,
      height: 0,
    };
  }
}
