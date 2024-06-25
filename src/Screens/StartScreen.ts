import { getImage } from "../utils/getAssest";

const font = "16px Shovel";
const fontColor = "purple";

const startImage = getImage("/maxresdefault.jpg");

export function drawStartScreen(ctx: CanvasRenderingContext2D) {
  ctx.drawImage(startImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = font;
  ctx.fillStyle = fontColor;
  ctx.fillText(
    "Press Enter to Start",
    ctx.canvas.width / 2 -  150,
    ctx.canvas.height / 2 + 55
  );
}
