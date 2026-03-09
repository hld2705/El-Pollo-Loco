class Menu {
  constructor(canvas,audio) {
    this.canvas = canvas;
    this.audio = audio;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.bgImage = new Image();
    this.bgImage.src = "img/9_intro_outro_screens/start/startscreen_2.png";
    this.clickHandler = this.handleClick.bind(this);
    canvas.addEventListener('pointerdown', this.clickHandler);
  }

  /**
   * Removes the event listener from the menu
   */
  destroy() {
    this.canvas.removeEventListener("pointerdown", this.clickHandler);
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
    ctx.font = "30px Sancreek";
    ctx.textAlign = "center";
    ctx.fillText("PLAY", this.x, this.y + 40);
    ctx.strokeText("PLAY", this.x, this.y + 40);
    ctx.fillText("TUTORIAL", this.x, this.y);
    ctx.strokeText("TUTORIAL", this.x, this.y);
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
      this.destroy();
      showMenu = false;
      world = new World(canvas, keyboard, this.audio);
      this.audio.playMusic("ingame");
    }
    if (mouseX > this.x - 100 && mouseX < this.x + 100 && mouseY > this.y - 10 && mouseY < this.y + 10) {
      menu = new Tutorial(this.canvas);
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
  }
}
