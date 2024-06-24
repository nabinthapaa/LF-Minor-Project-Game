import { Canvas } from "../constants/Canvas";
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
import { TVelocity } from "../types/Character";
import { Dimension, Position, SolidObject } from "../types/Position";
import { Character } from "./Character";
import Platform from "./Platform";
import { SpriteRender } from "./SpriteRenderer";
/**
 *
 *
 * @export
 * @class Player
 * @extends {Character}
 */
export class Player extends Character {
  position: Position = {
    x: 0,
    y: 0,
  };
  dimension: Dimension;
  velocity: TVelocity;
  sprite = "shine";
  currentSpiriteState = "shine";

  isSpirteReset = false;
  isGrounded = false;
  importantAnimationPlaying = false;
  isAttacking = false;
  isJumpAttacking = false;
  shouldFlip = false;
  shouldDamage = true;
  damageTimeout: ReturnType<typeof setTimeout> | null = null;

  health = 400;
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

  public init() {
    this.render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);
    this.position = {
      x: 0,
      y: 0,
    };
    this.cameraPosition_.x = 0;
    this.cameraPosition_.y = 0;
    this.health = 400;
    this.isGrounded = false;
    this.isSpirteReset = false;
    this.isGrounded = false;
    this.importantAnimationPlaying = false;
    this.isAttacking = false;
    this.isJumpAttacking = false;
    this.shouldFlip = false;
    this.shouldDamage = false;
  }

  public updatePlayer() {
    this.checkCanvasHorizontalEdgeCollision();
    this.applyGravity();
    this.updateHitBox();
  }

  /**
   * Draws the player on the canvas by using the sprite renderer and flips the player
   * based on the direction the player is facing
   * @param ctx {CanvasRenderingContext2D} - The canvas context to draw the player
   */
  public drawPlayer(ctx: CanvasRenderingContext2D) {
    this.render.animateSprite(this);
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition_
    );
    this.drawDamageBox(ctx);
  }

  drawDamageBox(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.damageBox.x,
      this.damageBox.y,
      this.damageBox.width,
      this.damageBox.height
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
    this.sprite = "shine";
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
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
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
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
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
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  /**
   * Excutes player jump attack action only when the player is jumping
   * and sets the player sprite to jump attack sprite
   * @returns {void}
   */
  public jumpAttack(): void {
    if (this.isGrounded || this.isAttacking) return;
    this.isJumpAttacking = true;
    this.sprite = "jumpAttack";
    this.addDamageBox();
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
    setInterval(() => {
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
    if(this.shouldFlip) this.position.x -= 10;
    this.sprite = "dig";
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 500);
    this.importantAnimationPlaying = true;
    this.addDamageBox();
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
    setInterval(() => {
      this.resetDamageBox();
    }, 500);
  }

  /**
   * Decrease the health of the player by the damage amount
   * @param damage {number}
   * @returns {void}
   */
  public takeDamage(damage: number): void {
    if (this.shouldDamage) {
      this.health = this.health ? this.health - damage : 0;
      if (!this.health) {
        this.init();
      }
    }

    if (!this.shouldDamage && !this.damageTimeout) {
      this.damageTimeout = setTimeout(() => {
        this.shouldDamage = true;
        this.damageTimeout = null;
      }, 1000);
    }
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
    } else if (this.position.x + this.dimension.width >= 200 * 16) {
      this.position.x = Canvas.CANVAS_WIDTH - this.dimension.width;
    }
  }

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

  private resetDamageBox(): void {
    this.damageBox = {
      x: this.position.x,
      y: this.position.y,
      width: 0,
      height: 0,
    };
  }
}
