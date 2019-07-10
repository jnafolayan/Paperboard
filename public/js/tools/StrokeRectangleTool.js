let fillColor = '#000';
let rect = null;

export default class StrokeRectangleTool {
  static render(state) {
    const { overlayCtx: ctx, cursor, pencilColor } = state;
    
    if (rect) {
      const startX = Math.min(rect.x, rect.endX);
      const endX = Math.max(rect.x, rect.endX);
      const startY = Math.min(rect.y, rect.endY);
      const endY = Math.max(rect.y, rect.endY);
      ctx.strokeStyle = pencilColor;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    }
  }

  static onMouseDown({ cursorDown, ctx }) {
    rect = {
      ...cursorDown,
      endX: cursorDown.x,
      endY: cursorDown.y
    };
  }

  static onMouseMove({ cursor, cursorDown, ctx }) {
    if (cursorDown) {
      rect.endX = cursor.x;
      rect.endY = cursor.y;
    }
  }

  static onMouseUp({ ctx, pencilColor }) {
    if (!rect) return;
    const startX = Math.min(rect.x, rect.endX);
    const endX = Math.max(rect.x, rect.endX);
    const startY = Math.min(rect.y, rect.endY);
    const endY = Math.max(rect.y, rect.endY);
    ctx.strokeStyle = pencilColor;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);

    rect = null;
  }
}
