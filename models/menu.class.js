class Menu {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    canvas.addEventListener("click", (e) => this.handleClick(e));
  }

  draw(ctx) {
    // round background
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "22px Sancreek";
    ctx.textAlign = "center";

    ctx.fillText("PLAY", this.x, this.y + 40);
    ctx.fillText("TUTORIAL", this.x, this.y);
    ctx.fillText("SETTINGS", this.x, this.y - 40);
  }

  handleClick(e) {
    if (!showMenu) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    if (mouseY > this.y + 20 && mouseY < this.y + 60) {
      this.startGame();
    }
  }

  startGame() {
    showMenu = false;
    world = new World(canvas, keyboard);
  }
}