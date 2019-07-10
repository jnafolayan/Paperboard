const eraserHalf = 5;

export default class EraserTool {
  static render(state) {
    const { overlayCtx: ctx, cursor } = state;
    
    ctx.save();
    ctx.strokeStyle = '#444';
    ctx.strokeRect(cursor.x - eraserHalf, cursor.y - eraserHalf, eraserHalf * 2, eraserHalf * 2);
    ctx.restore();
  }

  static update(state) {

  }

  static onMouseDown({ cursorDown, ctx }) {
  }

  static onMouseMove({ cursor, cursorDown, ctx }) {
    if (cursorDown) {
      ctx.clearRect(cursor.x - eraserHalf, cursor.y - eraserHalf, eraserHalf * 2, eraserHalf * 2);
    }
  }

  static onMouseUp(state) {

  }
}
