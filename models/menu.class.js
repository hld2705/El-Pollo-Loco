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
   * 
   * @param {canvas} ctx draws the circle in which the commands are contained
   */
  draw(ctx) {
    if (this.bgImage.complete) {
      ctx.drawImage(this.bgImage, 0, 0, 720, 480);
    }
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black"
    ctx.font = "38px Sancreek";
    ctx.textAlign = "center";
    ctx.font = this.hoverPlay ? "44px Sancreek" : "38px Sancreek";
    ctx.fillStyle = this.hoverPlay ? "yellow" : "white";
    ctx.fillText("PLAY", this.x, this.y + 40);
    ctx.strokeText("PLAY", this.x, this.y + 40);
    ctx.font = this.hoverTutorial ? "44px Sancreek" : "38px Sancreek";
    ctx.fillStyle = this.hoverTutorial ? "yellow" : "white";
    ctx.fillText("TUTORIAL", this.x, this.y);
    ctx.strokeText("TUTORIAL", this.x, this.y);
    ctx.font = this.hoverImpressum ? "44px Sancreek" : "38px Sancreek";
    ctx.fillStyle = this.hoverImpressum ? "yellow" : "white";
    ctx.fillText("IMPRESSUM", this.x, this.y - 40);
    ctx.strokeText("IMPRESSUM", this.x, this.y - 40);
  }

  /**
   * 
   * @param {Element} e parameter is listening to the user clicks
   * @returns the correct screen according to where the user clicks
   */
  handleClick(e) {
    if (!showMenu) return;
    this.audio.playMusic("menu");
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseY > this.y + 20 && mouseY < this.y + 60) {
      this.destroy(); showMenu = false;
      world = new World(canvas, keyboard, this.audio);
      this.audio.playMusic("ingame");
    }
    if (mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 10 && mouseY < this.y + 10) {
      this.destroy();
      menu = new Tutorial(this.canvas);
    }
    if (mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 60 && mouseY < this.y - 20) {
      this.destroy();
      menu = new Impressum(this.canvas);
    }
  }

  /**
   * Function that triggers the hover effect on the letters 
   */
  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.hoverPlay = mouseY > this.y + 20 && mouseY < this.y + 60;
    this.hoverTutorial = mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 10 && mouseY < this.y + 10;
    this.hoverImpressum = mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 60 && mouseY < this.y - 20;
    if (this.hoverPlay || this.hoverTutorial || this.hoverImpressum) {
      this.canvas.style.cursor = "pointer";
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  /**
   * 
   * @param {event} e notices that the user is hovering over an object
   * @returns cursor = "pointer"
   */
  isHovering(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (mouseY > this.y + 20 && mouseY < this.y + 60) {
      return true;
    }
    if (mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 10 && mouseY < this.y + 10) {
      return true;
    }
    if (mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 60 && mouseY < this.y - 20){
      return true;
    }
  }
}
