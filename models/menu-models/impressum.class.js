class Impressum extends Menu {
  constructor(canvas) {
    super(canvas, audio);
    this.hoverBack = false;
    this.canvas.style.cursor = "default";
    this.backWidth = 80;
    this.backHeight = 20;
    this.backX = this.x;
    this.backY = this.y - 110;
  }

  /**
   * 
   * @param {canvas} ctx draws the impressum for the game 
   */
  draw(ctx) {
    ctx.fillStyle = "#E59757";
    ctx.fillRect(this.x - 200, this.y - 150, 400, 300);
    ctx.fillStyle = "white";
    ctx.font = "20px Sancreek";
    ctx.textAlign = "center";
    ctx.fillText("Developer: Halid Crnkic", this.x, this.y - 60);
    ctx.fillText("Email: halidcrnkic@gmail.com", this.x, this.y - 30);
    ctx.fillText("Location: Graz, Austria", this.x, this.y);
    ctx.fillText("© 2026", this.x, this.y + 30);
    ctx.fillText("§5 Mediengesetz – Anbieterkennzeichnung", this.x, this.y + 60);
    ctx.fillText("Unternehmensgegenstand", this.x, this.y + 90)
    ctx.fillText("Entwicklung und Vertrieb", this.x, this.y + 120)
    ctx.fillText("von Computerspielen", this.x, this.y + 145)
    ctx.font = this.hoverBack ? "26px Sancreek" : "20px Sancreek";
    ctx.fillStyle = this.hoverBack ? "yellow" : "white";
    this.drawButton(ctx, "BACK", this.backX, this.backY, this.backWidth, this.backHeight, this.hoverBack);
  }

  /**
   * Function that draws the buttons
   */
  drawButton(ctx, text, x, y, width, height, hover) {
    ctx.fillStyle = hover ? "#f4b942" : "#8b5a2b";
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);
    ctx.fillStyle = "white";
    ctx.font = "16px Sancreek";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 5.5);
  }

  /**
   * @param {action} e registers the users click input in order to return back to the menu 
   */
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseX > this.backX - this.backWidth / 2 && mouseX < this.backX + this.backWidth / 2 &&
      mouseY > this.backY - this.backHeight / 2 &&
      mouseY < this.backY + this.backHeight / 2
    ) {this.canvas.style.cursor = "default";
      menu = new Menu(this.canvas, this.audio);
    }
  }

  /**
   * Needed for having the hover effect on the buttons for desktop users 
   */
  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const withinBackX = mouseX > this.backX - this.backWidth / 2 && mouseX < this.backX + this.backWidth / 2;
    const withinBackY = mouseY > this.backY - this.backHeight / 2 && mouseY < this.backY + this.backHeight / 2;
    this.hoverBack = withinBackX && withinBackY;
    this.canvas.style.cursor = this.hoverBack ? "pointer" : "default";
  }

  /**
   * Helper function (already declared in menu.class), needed to remove the cursor pointer from the text
   */
  isHovering(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const withinBackX = mouseX > this.backX - this.backWidth / 2 && mouseX < this.backX + this.backWidth / 2;
    const withinBackY = mouseY > this.backY - this.backHeight / 2 && mouseY < this.backY + this.backHeight / 2;
    return withinBackX && withinBackY;
  }
}