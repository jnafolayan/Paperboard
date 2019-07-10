let prevPoint = null;
let pencilColor = '#000';

export default class PencilTool {
  static render(state) {
    const { overlayCtx: ctx, cursor } = state;

    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = state.pencilColor;
    ctx.fill();
  }

  static onMouseDown({ cursorDown, ctx }) {
    prevPoint = { ...cursorDown };
  }

  static onMouseMove({ cursor, cursorDown, ctx, pencilColor }) {
    if (prevPoint) {
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(cursor.x, cursor.y);
      ctx.strokeStyle = pencilColor;
      ctx.stroke();
      prevPoint = { ...cursor };
    }
  }

  static onMouseUp(state) {
    prevPoint = null;
  }
}
