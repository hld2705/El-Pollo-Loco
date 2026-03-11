class Tutorial extends Menu {
  constructor(canvas) {
    super(canvas, audio);
    this.hoverBack = false;
  }

  /**
   * Draws the tutorial instructions + BACK button
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

    const btnY = this.y + 80;
    ctx.font = this.hoverBack ? "26px Sancreek" : "20px Sancreek";
    ctx.fillStyle = this.hoverBack ? "yellow" : "white";
    ctx.textAlign = "center";
    ctx.fillText("BACK", this.x, btnY);
  }

  /**
   * Handles click on BACK button
   */
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleY = this.canvas.height / rect.height;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseY > this.y + 60 && mouseY < this.y + 100) {
      menu = new Menu(this.canvas, this.audio);
    }
  }

  /**
   * Hover effect only on BACK button
   */
  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    this.hoverBack = mouseY > this.y + 60 && mouseY < this.y + 100;
    this.canvas.style.cursor = this.hoverBack ? "pointer" : "default";
  }

   /**
   * Helper function (already declared in menu.class), needed to remove the cursor pointer from the text
   */
  isHovering(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const withinBackX = mouseX > this.x - 100 && mouseX < this.x + 100;
    const withinBackY = mouseY > this.y + 60 && mouseY < this.y + 100;
    return withinBackX && withinBackY;
  }
}