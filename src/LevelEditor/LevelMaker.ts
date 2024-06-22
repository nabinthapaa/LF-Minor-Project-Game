import "../style.css";
import { tileset } from "../images/preLoad";
import { Position } from "../types/Position";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants/Sprite";

const canvasContainer = document.querySelector<HTMLDivElement>("#canvas")!;

const canvasLevelEditor = document.createElement<"canvas">("canvas");
const leCtx = canvasLevelEditor.getContext("2d")!;
const tileCanvas = document.createElement<"canvas">("canvas");
const tileCtx = tileCanvas.getContext("2d")!;

if (!leCtx) {
  throw new Error("Could not get canvas context");
}

const rows = 200 ;
const cols = 25;

canvasLevelEditor.width = rows  * TILE_WIDTH;
canvasLevelEditor.height = cols * TILE_HEIGHT;

const Mapdata = Array.from({ length: cols }, () =>
  Array.from({ length: rows }, () => 403)
);

tileCanvas.width = 16 * 25;
tileCanvas.height = 16 * 17;
tileCanvas.style.marginTop = "20px";

canvasContainer.appendChild(canvasLevelEditor);
document.body.appendChild(tileCanvas);
const mousePositionInGrid: Position = {
  x: 0,
  y: 0,
};

const mousePositionInTileSet: Position = {
  x: 0,
  y: 0,
};

export class LevelMaker {
  constructor() {}

  init() {
    this.drawGrid();
  }

  drawGrid() {
    leCtx.strokeStyle = "red";
    leCtx.beginPath();
    for (let i = 0; i < canvasLevelEditor.width; i += TILE_WIDTH) {
      leCtx.moveTo(i, 0);
      leCtx.lineTo(i, canvasLevelEditor.height);
    }
    for (let i = 0; i < canvasLevelEditor.height; i += TILE_WIDTH) {
      leCtx.moveTo(0, i);
      leCtx.lineTo(canvasLevelEditor.width, i);
    }
    leCtx.stroke();
  }

  levelEditor() {
    leCtx.clearRect(0, 0, canvasLevelEditor.width, canvasLevelEditor.height);
    this.drawGrid();
    this.drawMap();
    leCtx.drawImage(
      tileset,
      mousePositionInTileSet.x * 16,
      mousePositionInTileSet.y * 16,
      16,
      16,
      mousePositionInGrid.x * TILE_WIDTH,
      mousePositionInGrid.y * TILE_HEIGHT,
      TILE_WIDTH,
      TILE_HEIGHT
    );

    const x = mousePositionInGrid.x;
    const y = mousePositionInGrid.y;
    Mapdata[y][x] = mousePositionInTileSet.y * 25 + mousePositionInTileSet.x;
    console.log("🚀 ~ LevelMaker ~ levelEditor ~ Mapdata:", Mapdata)
    
  }

  drawMap() {
    for (let y = 0; y < Mapdata.length; y++) {
      for (let x = 0; x < Mapdata[y].length; x++) {
        const tile = Mapdata[y][x];
        const xPos = x * TILE_WIDTH;
        const yPos = y * TILE_HEIGHT;
        leCtx.drawImage(
          tileset,
          (tile % 25) * 16,
          Math.floor(tile / 25) * 16,
          16,
          16,
          xPos,
          yPos,
          TILE_WIDTH,
          TILE_HEIGHT
        );
      }
    }
  }

  getMapData() {
    console.log(Mapdata)   
    localStorage.setItem("mapData", JSON.stringify(Mapdata));
    // Download Map data
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(Mapdata));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mapData.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  loadMapData(file: File) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
      this.drawLoadedMap(reader.result as string);
    };
  }

  drawLoadedMap(mapData: string) {
    const data = JSON.parse(mapData);
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        Mapdata[y][x] = data[y][x];
      }
    }
    this.drawMap();
  }
}

class TileSet {
  constructor() {}

  init() {
    this.drawTileSet();
  }

  drawTileSet() {
    for (let y = 0; y < 17; y++) {
      for (let x = 0; x < 25; x++) {
        const tile = y * 25 + x;
        const xPos = x * 16;
        const yPos = y * 16;
        tileCtx.drawImage(
          tileset,
          (tile % 25) * 16,
          Math.floor(tile / 25) * 16,
          16,
          16,
          xPos,
          yPos,
          16,
          16
        );
      }
    }
  }
}

const levelMaker = new LevelMaker();
const tilesSet = new TileSet();



window.onload = () => {
  levelMaker.init();
  tilesSet.init();
};


const button = document.createElement("button");
button.textContent = "Get Map Data";
button.style.marginTop = "20px";
button.style.display = "block";
document.body.appendChild(button);


const eraser = document.createElement("button");
eraser.textContent = "Eraser";
eraser.style.marginTop = "20px";
eraser.style.display = "block";
document.body.appendChild(eraser);

const loadMapData = document.createElement("input");
loadMapData.setAttribute("type", "file");
loadMapData.textContent = "Eraser";
loadMapData.style.marginTop = "20px";
loadMapData.style.display = "block";
document.body.appendChild(loadMapData);

loadMapData.onchange = (e: any) => {
  if(e.target)
    console.log(e.target.files[0])
  levelMaker.loadMapData(e.target.files[0]);
};

button.onclick = () => {
  levelMaker.getMapData();
};

eraser.onclick = () => {
    mousePositionInTileSet.x = 4;
    mousePositionInTileSet.y = 17;
};

tileCanvas.addEventListener("click", (e) => {
  mousePositionInTileSet.x = Math.floor(e.offsetX / 16);
  mousePositionInTileSet.y = Math.floor(e.offsetY / 16);
});

let isDragging = false;
canvasLevelEditor.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // Left mouse button
    isDragging = true;
    mousePositionInGrid.x = Math.floor(e.offsetX / TILE_WIDTH);
    mousePositionInGrid.y = Math.floor(e.offsetY / TILE_HEIGHT);
    levelMaker.levelEditor(); // Execute once immediately
  }
});

canvasLevelEditor.addEventListener("mousemove", (e) => {
  if (isDragging) {
    mousePositionInGrid.x = Math.floor(e.offsetX / TILE_WIDTH);
    mousePositionInGrid.y = Math.floor(e.offsetY / TILE_HEIGHT);
    levelMaker.levelEditor();
  }
});

// Stop dragging when mouse is released
canvasLevelEditor.addEventListener("mouseup", () => {
  isDragging = false;
});

// Stop dragging when mouse leaves the canvas
canvasLevelEditor.addEventListener("mouseleave", () => {
  isDragging = false;
});

canvasLevelEditor.addEventListener("dragstart", (event) => {
  event.preventDefault();
});
