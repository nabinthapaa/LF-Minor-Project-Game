import {
  GRAVITY,
  PLAYER_X_SPEED,
  PLAYER_Y_SPEED,
} from "../../constants/Character";
import { PlayerSpriteDimensions } from "../../constants/SpriteDimensions";
import { TVelocity } from "../../types/Character";
import { Dimension, Position, SolidObject } from "../../types/Position";
import Player from "../Player";
import { SpriteRender } from "../SpriteRenderer";
import { Enemy } from "./Enemy";

/**
 * Player class that is used for making a playable
 * character in the game
 * @extends {Enemy}
 */
export default class Boss extends Enemy {
  position: Position = {
    x: 0,
    y: 0,
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
  jumpAttackCount = 0;
  jumpAttackTime = 0;
  groundLevel = 0;
  maxMoveDistance: number = 100;
  leftBoundary: number = 0;
  lastAttackTime = Date.now();

  gold = 0;
  render = new SpriteRender(PlayerSpriteDimensions[this.sprite]);
  isHittingBoundary: boolean = false;

  constructor(public cameraPosition: Position, position: Position) {
    super(cameraPosition, position);
    this.position = { ...position };
    this.dimension = {
      width: PlayerSpriteDimensions[this.sprite].frameWidth,
      height: PlayerSpriteDimensions[this.sprite].frameHeight,
    };
    this.velocity = { x: PLAYER_X_SPEED, y: PLAYER_Y_SPEED };
    this.groundLevel = position.y;
    this.leftBoundary = position.x;
    this.health = 400;
    this.maxHealth = 400;
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
  public update(_: Player, ctx: CanvasRenderingContext2D): void {
    this.checkCanvasHorizontalEdgeCollision();
    this.applyGravity();
    this.drawBoss(ctx);
    this.drawHealthBar(ctx);
    if (this.isHittingBoundary) {
      this.sprite = "idle";
      this.switchSprite();
    }
  }

  /**
   * Draws the player on the canvas by using the sprite renderer and flips the player
   * based on the direction the player is facing
   * @param ctx {CanvasRenderingContext2D} - The canvas context to draw the player
   * @returns {void}
   */
  public drawBoss(ctx: CanvasRenderingContext2D): void {
    this.render.animateSprite();
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
    this.velocity.x = -PLAYER_X_SPEED / 2;
    this.position.x += this.velocity.x;
    this.shouldFlip = true;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.switchSprite();
  }

  /**
   * Moves the player right using an constant player
   * speed defined in constants/Character.ts
   * @returns {void}
   */
  public moveRight(): void {
    this.velocity.x = PLAYER_X_SPEED / 2;
    this.position.x += this.velocity.x;
    this.shouldFlip = false;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.switchSprite();
  }

  /**
   * Excutes player jump action only when the player is on ground
   * and sets the player sprite to jump sprite
   * @returns {void}
   */
  public jump(): void {
    this.isGrounded = false;
    this.velocity.y = -15;
    this.position.y += this.velocity.y;
  }

  /**
   * Excutes player jump attack action only when the player is jumping
   * and sets the player sprite to jump attack sprite
   * @returns {void}
   */
  public jumpAttack(): void {
    if (this.isAttacking && this.jumpAttackCount > 3) return;
    if (this.jumpAttackTime === 0) this.jumpAttackTime = Date.now();
    if (Date.now() - this.jumpAttackTime > 1000) {
      this.jumpAttackTime = Date.now();
      this.jump();
      this.sprite = "jumpAttack";
      this.switchSprite();
      this.isJumpAttacking = true;
      this.jumpAttackCount++;
      if (this.jumpAttackCount > 3) this.jumpAttackCount = 0;
      setTimeout(() => {
        if (this.shouldFlip) this.position.x += 10;
        this.isJumpAttacking = false;
      }, 500);
    }
    if (this.jumpAttackCount > 3) {
      this.jumpAttackCount = 0;
      this.jumpAttackTime = 0;
    }
  }

  public moveBoss(player: Player, distance = 100): void {
    let enemyPlayerDistance = this.position.x - player.position.x;
    if (this.position.x < player.position.x) {
      this.shouldFlip = false;
    }
    if (this.position.x > player.position.x) {
      this.shouldFlip = true;
    }
    if (
      Math.abs(enemyPlayerDistance) > distance &&
      !this.isJumpAttacking &&
      !this.isAttacking
    ) {
      if (enemyPlayerDistance > 0) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
      return;
    }
  }

  public attackPlayer(player: Player): void {
    if (Date.now() - this.lastAttackTime < 1000) return;
    
    if (Math.random() > 0.5 && this.jumpAttackCount < 3) {
      this.jumpAttack();
      player.takeDamage(200);
      player.isInvincible = true;
      this.jumpAttackCount++;
      this.moveBoss(player, 50);
      this.isAttacking = false;
      if (this.jumpAttackCount >= 3) {
        this.jumpAttackCount = 0;
      }
    } else if (this.jumpAttackCount === 3 || !this.isJumpAttacking) {
      this.moveBoss(player, 10);
      this.isJumpAttacking = false;
      this.attackNormal();
      player.takeDamage(100);
      this.isAttacking = true;
      player.isInvincible = true;
    }
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
      this.isAttacking = false;
      this.isInvincible = false;
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
    if (this.position.y + this.dimension.height >= this.groundLevel) {
      this.isGrounded = true;
      this.position.y = this.groundLevel;
    }
  }

  /**
   * Checks for horizontal collision with the canvas edge
   * if the player is at the edge of the canvas, the player is stopped from moving
   * @returns {void}
   */
  private checkCanvasHorizontalEdgeCollision(): void {
    if (this.position.x <= this.leftBoundary - this.maxMoveDistance) {
      this.position.x = this.leftBoundary - this.maxMoveDistance;
      this.isHittingBoundary = true;
    } else if (this.position.x > this.leftBoundary) {
      this.position.x = this.leftBoundary;
      this.isHittingBoundary = true;
    }
  }
}
