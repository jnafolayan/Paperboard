import PencilTool from './tools/PencilTool.js';
import RectangleTool from './tools/RectangleTool.js';
import StrokeRectangleTool from './tools/StrokeRectangleTool.js';
import EraserTool from './tools/EraserTool.js';
import LineTool from './tools/LineTool.js';
import state from './state.js';

// register tools
state.registerTool('pencil', PencilTool);
state.registerTool('eraser', EraserTool);
state.registerTool('rect', RectangleTool);
state.registerTool('stroke_rect', StrokeRectangleTool);
state.registerTool('line', LineTool);

let colorToolIcon;
let canChangeSize = true;

function loop() {
  state.time = Date.now();
  state.delta = Math.min(1000, state.time - state.lastTime) / 1000;

  update();
  render();

  state.lastTime = state.time;
  requestAnimationFrame(loop);
}

function checkSize() {
  if (!canChangeSize) return;
  canChangeSize = false;
  const { canvas } = state.ctx;
  const { canvas: overlayCanvas } = state.overlayCtx;
  const style = window.getComputedStyle(document.querySelector('.board__canvases'));
  const width = parseInt(style.width, 10);
  const height = parseInt(style.height, 10);
  
  const cache = new Image();
  cache.onload = () => {
    canChangeSize = true;
    state.ctx.drawImage(cache, 0, 0, width, height, 0, 0, width, height);
  };
  cache.src = canvas.toDataURL();

  canvas.width = width;
  canvas.height = height;
  overlayCanvas.width = width;
  overlayCanvas.height = height;
}

function update() {
  const tool = state.getCurrentTool();
  tool.update && tool.update(state);

  colorToolIcon.style.borderBottom = `2px solid ${state.pencilColor}`;
}

function render() {
  const bounds = state.getBoardSize();
  state.overlayCtx.clearRect(0, 0, bounds.width, bounds.height);
  
  const tool = state.getCurrentTool();
  tool.render && tool.render(state);
}

function setupDOM() {
  const canvas = document.querySelector('#canvas');
  const overlayCanvas = document.querySelector('#overlayCanvas');

  const clearBoard = document.querySelector('#clearBoard');
  const exportImage = document.querySelector('#exportImage');
  
  const pencilTool = document.querySelector('#pencilTool');
  const eraserTool = document.querySelector('#eraserTool');
  const colorTool = document.querySelector('#colorTool');
  const colorInput = document.querySelector('#colorInput');
  colorToolIcon = document.querySelector('#colorTool .lnr-drop');
  const rectTool = document.querySelector('#rectTool');
  const strokeRectTool = document.querySelector('#strokeRectTool');
  const lineTool = document.querySelector('#lineTool');
  
  state.ctx = canvas.getContext('2d');
  state.overlayCtx = overlayCanvas.getContext('2d');

  addEvent(clearBoard, 'click', event => {
    event.preventDefault();
    const { width, height } = state.getBoardSize();
    state.ctx.clearRect(0, 0, width, height);
  });

  addEvent(exportImage, 'click', event => {
    event.preventDefault();
    const dataURL = state.ctx.canvas.toDataURL();
    const a = document.createElement('a');
    a.setAttribute('download', `Sketch_${Date.now()}`);
    a.setAttribute('href', dataURL);
    a.click();
  });

  addEvent(pencilTool, 'click', changeTool('pencil'), false);
  addEvent(eraserTool, 'click', changeTool('eraser'), false);
  addEvent(rectTool, 'click', changeTool('rect'), false);
  addEvent(strokeRectTool, 'click', changeTool('stroke_rect'), false);
  addEvent(lineTool, 'click', changeTool('line'), false);
  addEvent(colorInput, 'change', ({ target }) => state.pencilColor = target.value, false);

  addEvent(overlayCanvas, 'mousedown', onMouseDown, false);
  addEvent(overlayCanvas, 'mousemove', onMouseMove, false);
  addEvent(overlayCanvas, 'mouseup', onMouseUp, false);

  function addEvent(el, type, cb) {
    el.addEventListener(type, cb);
    if (type == 'mousedown')
      el.addEventListener('touchstart', event => cb(event.changedTouches[0]));
    if (type == 'mousemove')
      el.addEventListener('touchmove', event => cb(event.changedTouches[0]));
    if (type == 'mouseup')
      el.addEventListener('touchend', event => cb(event.changedTouches[0]));
  }
}

function onMouseDown(event) {
  const coords = getAbsoluteCoords(event);
  state.cursorDown = coords;
  const tool = state.getCurrentTool();
  tool.onMouseDown && tool.onMouseDown(state);
}

function onMouseMove(event) {
  const coords = getAbsoluteCoords(event);
  state.cursor = coords;
  const tool = state.getCurrentTool();
  tool.onMouseMove && tool.onMouseMove(state);
}

function onMouseUp(event) {
  const coords = getAbsoluteCoords(event);
  state.cursor = coords;
  state.cursorDown = null;
  const tool = state.getCurrentTool();
  tool.onMouseUp && tool.onMouseUp(state);
}

function getAbsoluteCoords(event) {
  const bounds = event.target.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top 
  };
}
 
function changeTool(toolKey) {
  return function change(event) {
    document.querySelector('.board__tool.active').classList.remove('active');
    this.classList.add('active');
    state.setTool(toolKey);
  }
}

window.onload = () => {
  setupDOM();
  checkSize();

  state.setTool('pencil');
  loop();
};

window.onresize = checkSize;