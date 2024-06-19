import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";

const canvasLevelEditor = document.createElement<"canvas">("canvas");
const leCtx = canvasLevelEditor.getContext("2d")!;


if (!leCtx) {
  throw new Error("Could not get canvas context");
}

canvasLevelEditor.width = 16 * 25;
canvasLevelEditor.height = 16 * 25;
canvasLevelEditor.style.border = "1px solid black";

document.body.appendChild(canvasLevelEditor);
const mousePositionInGrid: Position = {
  x: 0,
  y: 0,
};

export class LevelMaker {
  constructor() {
    this.init();
  }

  init() {
    this.drawGrid();
  }

  drawGrid() {
    leCtx.beginPath();
    for (let i = 0; i < canvasLevelEditor.width; i += 16) {
      leCtx.moveTo(i, 0);
      leCtx.lineTo(i, canvasLevelEditor.height);
    }
    for (let i = 0; i < canvasLevelEditor.height; i += 16) {
      leCtx.moveTo(0, i);
      leCtx.lineTo(canvasLevelEditor.width, i);
    }
    leCtx.stroke();
  }

  levelEditor() {}
}



const levelMaker = new LevelMaker();

canvasLevelEditor.addEventListener("click", (e) => {
  mousePositionInGrid.x = Math.floor(e.offsetX / 16);
  mousePositionInGrid.y = Math.floor(e.offsetY / 16);
  levelMaker.levelEditor();
});
