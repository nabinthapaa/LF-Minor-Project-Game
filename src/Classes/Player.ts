import { Canvas } from "../constants/Canvas";
import { GRAVITY } from "../constants/Character";
import { PlayerSpriteDimensions } from "../constants/SpriteDimensions";
import { playerSpriteImage } from "../images/preLoad";
import { TVelocity } from "../types/Character";
import { Dimension, Position } from "../types/Position";
import { SpriteRender } from "./SpriteRenderer";

export class Player {
  position: Position;
  dimension: Dimension;
  velocity: TVelocity;
  sprite = "shine";
  isSpirteReset = false;
  currentSpiriteState = "shine";
  isGrounded = true;
  importantAnimationPlaying = false;
  isDigging = false;
  facingDirection = "right";
  render = new SpriteRender(
    playerSpriteImage[this.sprite],
    PlayerSpriteDimensions[this.sprite].width,
    PlayerSpriteDimensions[this.sprite].height,
    PlayerSpriteDimensions[this.sprite].frameCount
  );
  
  constructor() {
    this.position = { x: 0, y: 48 };
    this.dimension = {
      width: PlayerSpriteDimensions[this.sprite].width * Canvas.SCALE,
      height: PlayerSpriteDimensions[this.sprite].height * Canvas.SCALE,
    };
    this.velocity = { x: 0, y: 0 };
  }

  public drawPlayer(ctx: CanvasRenderingContext2D) {
    this.render.animateSprite(this);
    if (this.facingDirection === "right") {
      this.render.drawFrame(ctx, this.position);
    } else {
      this.render.drawFrame(ctx, this.position, true);
    }
  }

  private switchSprite() {
    let spriteToSwitch = PlayerSpriteDimensions[this.sprite];
    this.render.switchSprite(spriteToSwitch);
    this.dimension = {
      width: Canvas.SCALE* spriteToSwitch.width,
      height: Canvas.SCALE * spriteToSwitch.height,
    };
    this.isSpirteReset = false;
  }

  public moveLeft() {
    this.position.x -= 10;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.facingDirection = "left";
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  public moveRight() {
    this.position.x += 10;
    if (!this.isGrounded) return;
    this.sprite = "walk";
    this.facingDirection = "right";
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
  }

  public resetSprite() {
    if (!this.isGrounded || this.importantAnimationPlaying) return;
    this.sprite = "shine";
    if (!this.isSpirteReset) {
      this.switchSprite();
      this.isSpirteReset = true;
      this.currentSpiriteState = this.sprite;
    }
  }

  public jump() {
    if (this.isGrounded) {
      this.velocity.y -= 18;
      this.position.y += this.velocity.y;
      this.sprite = "jump";
      if (this.currentSpiriteState !== this.sprite) {
        this.switchSprite();
        this.currentSpiriteState = this.sprite;
      }
      this.isGrounded = false;
    }
  }

  public jumpAttack() {
    if (!this.isGrounded) {
      this.sprite = "jumpAttack";
      if (this.currentSpiriteState !== this.sprite) {
        this.switchSprite();
        this.currentSpiriteState = this.sprite;
      }

      //TODO: Collision Check with Enemy and environment
    }
  }

  public attackNormal() {
    if (!this.isGrounded || this.isDigging) return;
    this.sprite = "dig";
    this.importantAnimationPlaying = true;
    if (this.currentSpiriteState !== this.sprite) {
      this.switchSprite();
      this.currentSpiriteState = this.sprite;
    }
    //TODO: Collision check with enemy and environment
  }

  public checkGroundCollision() {
    return (
      this.position.y + this.dimension.height + this.velocity.y >=
      Canvas.CANVAS_HEIGHT - 48
    );
  }

  public applyGravity() {
    if (!this.checkGroundCollision()) {
      this.velocity.y += GRAVITY;
      this.isGrounded = false;
    } else {
      this.velocity.y = 0;
      this.isGrounded = true;
    }
    this.position.y += this.velocity.y;
  }
}
