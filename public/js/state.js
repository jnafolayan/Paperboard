const state = {
  toolKey: null,
  tools: {},

  graphics: [],
  pencilColor: '#000000',

  // input
  cursor: { x: -1, y: -1 },
  cursorDown: null,

  ctx: null,
  overlayCtx: null,
  time: 0,
  lastTime: 0,
  delta: 0,

  getBoardSize() {
    return {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    };
  },

  registerTool(key, tool) {
    this.tools[key] = tool;
  },

  setTool(key) {
    this.toolKey = key;
  },

  getTool(key) {
    return this.tools[key];
  },

  getCurrentTool() {
    return this.tools[this.toolKey];
  }
};

export default state;