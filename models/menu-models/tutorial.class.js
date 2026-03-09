class Tutorial extends Menu {
  constructor(canvas) {
    super(canvas);
  }

  /**
   * 
   * @param {canvas} ctx draws the tutorial for the game 
   */
  draw(ctx) {
    ctx.fillStyle = "#E59757";
    ctx.fillRect(this.x - 200, this.y - 150, 400, 300);
    ctx.fillStyle = "white";
    ctx.font = "20px Sancreek";
    ctx.textAlign = "left";
    ctx.fillText("MOVE LEFT-RIGHT: A D", this.x - 150, this.y - 35);
    ctx.fillText("JUMP: W", this.x - 150, this.y);
    ctx.fillText("THROW: SPACE", this.x - 150, this.y + 35);
    ctx.fillText("BACK", this.x - 150, this.y + 80);
  }

  /**
   * 
   * @param {action} e registers the users click input in order to return back to the menu 
   */
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleY = this.canvas.height / rect.height;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseY > this.y + 60 && mouseY < this.y + 100) {
      menu = new Menu(this.canvas);
    }
  }

  /**
   * Needed for having the hover effect on the buttons for desktop users 
   */
  isHovering(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    if (mouseY > this.y + 90 && mouseY < this.y + 120) {
      return true;
    }
    return false;
  }
}