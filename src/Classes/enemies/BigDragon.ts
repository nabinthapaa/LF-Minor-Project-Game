import { bigDragonSprite } from "../../constants/EnemySprite";
import { Position } from "../../types/Position";
import Bubble from "../objects/Bubble";
import Player from "../Player";
import { SpriteRender } from "../SpriteRenderer";
import { Enemy } from "./Enemy";

export default class BigDragon extends Enemy {
  shouldFlip = true;
  hitbox = {
    x: this.position.x,
    y: this.position.y,
    width: 100,
    height: 100,
  };
  noHitbox = {
    x: this.position.x,
    y: this.position.y,
    width: 0,
    height: 0,
  };

  attackTimeout: ReturnType<typeof setTimeout> | null = null;
  isAttacking = false;
  lastRemovedBubble = 0;
  currentSprite: string = "";
  attackTimer: number = 0;
  thisForwards = true;

  bubbles: Bubble[] = [];
  constructor(public cameraPosition: Position, public position: Position) {
    super(cameraPosition, position);
    this.health = 600;
    this.maxHealth = 600;
    this.sprite = "sleep";
    this.render = new SpriteRender(bigDragonSprite[this.sprite]);
    this.dimension = {
      width: bigDragonSprite[this.sprite].frameWidth,
      height: bigDragonSprite[this.sprite].frameHeight,
    };
    this.addDamageHitBox();
    this.addNoDamageHitBox();
    this.generateBubbles();
  }

  private switchSprite(): void {
    if (this.sprite === this.currentSprite) return;
    this.currentSprite = this.sprite;
    this.dimension = {
      width: bigDragonSprite[this.sprite].frameWidth,
      height: bigDragonSprite[this.sprite].frameHeight,
    };
    this.render.switchSprite(bigDragonSprite[this.sprite]);
  }

  public renderEnemy(player: Player, ctx: CanvasRenderingContext2D): void {
    if (this.isAttacking || this.bubbles.length > 0)
      this.moveBubbles(player, ctx);
    this.render.animateSprite();
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition
    );
  }

  public addDamageHitBox(): void {
    this.hitbox.x = this.position.x + 25;
    this.hitbox.y = this.position.y + 57;
    this.hitbox.height = this.dimension.height / 4;
    this.hitbox.width = this.dimension.width / 4;
  }

  public addNoDamageHitBox(): void {
    const width =
      this.position.x +
      this.dimension.width -
      (this.hitbox.x + this.hitbox.width);

    const x_location = this.hitbox.x + this.hitbox.width;
    this.noHitbox.x = x_location;
    this.noHitbox.y = this.position.y;
    this.noHitbox.height = this.dimension.height;
    this.noHitbox.width = width;
  }

  public update(player: Player, ctx: CanvasRenderingContext2D): void {
    if (this.isAttacking) this.sprite = "attack";
    else this.sprite = "sleep";
    if (this.isAttacking && this.bubbles.length === 0) this.generateBubbles();
    this.renderEnemy(player, ctx);
    this.switchSprite();
    this.drawHealthBar(ctx);
  }

  public move(): void {
    if (
      (!(this.sprite === "moveFront") && !this.isAttacking) ||
      !this.thisForwards
    ) {
      this.sprite = "moveFront";
      if (this.currentMoveDistance === this.maxMoveDistance) {
        this.velocity.x = -this.velocity.x;
        this.currentMoveDistance = 0;
      }

      this.position.x += this.velocity.x;
      this.currentMoveDistance++;
      this.thisForwards = true;
    }
  }

  public moveBack(): void {
    if ((this.sprite === "sleep" && !this.isAttacking) || this.thisForwards) {
      this.sprite = "moveBack";
      this.switchSprite();
      if (this.currentMoveDistance === this.maxMoveDistance) {
        this.velocity.x = -this.velocity.x;
        this.currentMoveDistance = 0;
      }

      this.position.x -= this.velocity.x;
      this.currentMoveDistance++;
    }
  }

  public attackPlayer() {
    if (this.isAttacking) {
      this.sprite = "attack";
      return;
    }
    if (!this.isAttacking) {
      this.attackTimer = 0;
      this.sprite = "sleep";
    }
  }

  private moveBubbles(player: Player, ctx: CanvasRenderingContext2D) {
    if (!this.isAlive()) {
      this.bubbles = [];
      return;
    }
    this.bubbles.forEach((bubble, index) => {
      if (bubble.isCollidingWithObject(player.hitbox)) {
        player.takeDamage(80);
        this.bubbles.splice(index, 1);
        if (index === 0) this.lastRemovedBubble++;
        if (this.isAttacking) this.addBubbles();
      }

      if (bubble.isOutOfBounds()) {
        this.bubbles.splice(index, 1);
        if (index === 0) this.lastRemovedBubble++;
        if (this.isAttacking) this.addBubbles();
      }
      bubble.move();
      bubble.update(ctx);
    });
  }

  private addBubbles() {
    if (!this.isAlive()) return;
    if (this.lastRemovedBubble === 3) {
      this.lastRemovedBubble = 0;
    }
    let bubble = new Bubble(this.cameraPosition, {
      x: this.position.x - this.lastRemovedBubble * 40,
      y: this.hitbox.y - this.lastRemovedBubble * 20,
    });
    this.bubbles.push(bubble);
  }

  private generateBubbles() {
    for (let i = 0; i < 3; i++) {
      let bubble = new Bubble(this.cameraPosition, {
        x: this.position.x - i * 28,
        y: this.hitbox.y - i * 10,
      });
      this.bubbles.push(bubble);
    }
  }

  public takeDamage(damage: number): void {
    super.takeDamage(damage);
    if (this.health <= 300) {
      this.moveBack();
    }
  }
}
