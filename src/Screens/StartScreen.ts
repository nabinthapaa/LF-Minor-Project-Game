const font = "10px Shovel";
const fontColor = "white";

export function drawStartScreen(ctx: CanvasRenderingContext2D) {
  ctx.font = font;
  ctx.fillStyle = fontColor;
  ctx.fillText("Press Enter to Start", ctx.canvas.width / 2 - 80, ctx.canvas.height / 2 - 10);
}