import { bigDragonSprite } from "../../constants/EnemySprite";
import { Position } from "../../types/Position";
import Bubble from "../Bubble";
import { Player } from "../Player";
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

  bubbles: Bubble[] = [];
  constructor(public cameraPosition: Position, public position: Position) {
    super(cameraPosition, position);
    this.health = 600;
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
    this.render.switchSprite(bigDragonSprite[this.sprite]);
    this.dimension = {
      width: bigDragonSprite[this.sprite].frameWidth,
      height: bigDragonSprite[this.sprite].frameHeight,
    };
  }

  public renderEnemy(player: Player, ctx: CanvasRenderingContext2D): void {
    if (this.isAttacking) this.moveBubbles(player, ctx);
    this.render.animateSprite();
    this.render.drawFrame(
      ctx,
      this.position,
      this.dimension,
      this.shouldFlip,
      this.cameraPosition
    );
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.position.x - this.cameraPosition.x,
      this.position.y - this.cameraPosition.y,
      this.dimension.width,
      this.dimension.height
    );
    this.drawHitBox(ctx);
    this.drawNoHitBox(ctx);
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

  private drawNoHitBox(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.strokeRect(
      this.noHitbox.x - this.cameraPosition.x,
      this.noHitbox.y - this.cameraPosition.y,
      this.noHitbox.width,
      this.noHitbox.height
    );
    ctx.restore();
  }

  private drawHitBox(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "green";
    ctx.strokeRect(
      this.hitbox.x - this.cameraPosition.x,
      this.hitbox.y - this.cameraPosition.y,
      this.hitbox.width,
      this.hitbox.height
    );
    ctx.restore();
  }

  public move(): void {
    if (this.sprite === "sleep" && !this.isAttacking) {
      console.log("Moving");
      console.log(this.position);
      this.sprite = "moveFront";
      this.switchSprite();
      if (this.currentMoveDistance === this.maxMoveDistance) {
        this.velocity.x = -this.velocity.x;
        this.currentMoveDistance = 0;
      }

      this.position.x += this.velocity.x;
      this.currentMoveDistance++;
    }
  }

  public attackPlayer() {
    if (this.isAttacking && this.sprite === "attack") {
      this.sprite = "sleep";
      this.switchSprite();
      return;
    }
    if (this.sprite === "sleep" && !this.isAttacking) {
      this.sprite = "attack";
      if (!this.attackTimeout && this.sprite === "attack") {
        this.isAttacking = true;
        this.switchSprite();
        this.attackTimeout = setTimeout(() => {
          this.sprite = "sleep";
          this.switchSprite();
          this.attackTimeout = null;
          this.isAttacking = false;
        }, 10000);
      }
    }
  }

  private moveBubbles(player: Player, ctx: CanvasRenderingContext2D) {
    this.bubbles.forEach((bubble, index) => {
      if (bubble.isCollidingWithObject(player.hitbox)) {
        player.takeDamage(10);
        player.shouldDamage = false;
        this.bubbles.splice(index, 1);
        if (index === 0) this.lastRemovedBubble++;
        this.addBubbles();
      }

      if (bubble.isOutOfBounds()) {
        this.bubbles.splice(index, 1);
        if (index === 0) this.lastRemovedBubble++;
        this.addBubbles();
      }
      bubble.move();
      bubble.update(ctx);
    });
  }

  private addBubbles() {
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
}
