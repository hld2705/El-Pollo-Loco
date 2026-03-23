class Menu {
  constructor(canvas, audio) {
    this.canvas = canvas;
    this.audio = audio;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.bgImage = new Image();
    this.hoverPlay = false;
    this.hoverTutorial = false;
    this.hoverImpressum = false;
    this.moveHandler = this.handleMove.bind(this);
    canvas.addEventListener("pointermove", this.moveHandler);
    this.bgImage.src = "img/9_intro_outro_screens/start/startscreen_2.png";
    this.clickHandler = this.handleClick.bind(this);
    canvas.addEventListener('pointerdown', this.clickHandler);
  }

  /**
   * Removes the event listener from the menu
   */
  destroy() {
    this.canvas.removeEventListener("pointerdown", this.clickHandler);
    this.canvas.removeEventListener("pointermove", this.moveHandler);
  }

  /**
   * @param {canvas} ctx draws the circle in which the commands are contained
   */
  draw(ctx) {
    if (this.bgImage.complete) {
      ctx.drawImage(this.bgImage, 0, 0, 720, 480);}
    ctx.textAlign = "center";
    ctx.font = "32px Sancreek";
    const y = 60;
    const spacing = 240;
    this.drawButton(ctx, "IMPRESSUM", this.canvas.width / 2 - spacing, y, 220, 50, this.hoverImpressum);
    this.drawButton(ctx, "TUTORIAL", this.canvas.width / 2, y, 220, 50, this.hoverTutorial);
    this.drawButton(ctx, "PLAY", this.canvas.width / 2 + spacing, y, 220, 50, this.hoverPlay);
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
    ctx.font = "30px Sancreek";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 10);
  }

  /**
   * @param {Element} e parameter is listening to the user clicks
   * @returns the correct screen according to where the user clicks
   */
  handleClick(e) {
    if (!showMenu) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseX > this.x + 240 - 110 && mouseX < this.x + 240 + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) {
      this.destroy(); showMenu = false;
      world = new World(canvas, keyboard, this.audio);
      this.audio.playMusic("ingame");
    } if (mouseX > this.x - 110 && mouseX < this.x + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) { this.destroy();
      menu = new Tutorial(this.canvas, this.audio);
    } if (mouseX > this.x - 240 - 110 && mouseX < this.x - 240 + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) { this.destroy();
      menu = new Impressum(this.canvas, this.audio);}
  }

  /**
   * Function that triggers the hover effect on the letters 
   */
  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    this.hoverImpressum = this.isInside(mouseX, mouseY, this.x - 240, 60, 220, 50);
    this.hoverTutorial = this.isInside(mouseX, mouseY, this.x, 60, 220, 50);
    this.hoverPlay = this.isInside(mouseX, mouseY, this.x + 240, 60, 220, 50);
    if (this.hoverPlay || this.hoverTutorial || this.hoverImpressum) {
      this.canvas.style.cursor = "pointer";
    } else { this.canvas.style.cursor = "default"; }
  }

  /**
   * Helper function so the buttons get lid up when a user hovers over it, needed for the correct checkbox
   */
  isInside(mouseX, mouseY, x, y, width, height) {
    return (
      mouseX > x - width / 2 &&
      mouseX < x + width / 2 &&
      mouseY > y - height / 2 &&
      mouseY < y + height / 2
    );
  }

  /**
   * @param {event} e notices that the user is hovering over an object
   * @returns cursor = "pointer"
   */
  isHovering(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseX > this.x + 240 - 110 && mouseX < this.x + 240 + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) {
      return true;}
    if (mouseX > this.x - 110 && mouseX < this.x + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) {
      return true;}
    if (mouseX > this.x - 240 - 110 && mouseX < this.x - 240 + 110 && mouseY > 60 - 25 && mouseY < 60 + 25) {
      return true;}
      return false;
  }

}
