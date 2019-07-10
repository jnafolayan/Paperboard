let fillColor = '#000';
let points = [];

export default class LineTool {
  static render(state) {
    const { overlayCtx: ctx, cursor, pencilColor } = state;
    
    if (points.length) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.strokeStyle = pencilColor;
      ctx.stroke();
    }
  }

  static onMouseDown({ cursorDown, ctx }) {
    points.length = 0;
    points.push({ ...cursorDown });
    points.push({ ...cursorDown });
  }

  static onMouseMove({ cursor, cursorDown, ctx }) {
    if (cursorDown) {
      points[1] = { ...cursor };
    }
  }

  static onMouseUp({ ctx, pencilColor }) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.strokeStyle = pencilColor;
    ctx.stroke();
  }
}
