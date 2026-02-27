class EndGame extends DrawableObject {

    pictureGameOver = 'img/You won, you lost/Game Over.png';
    pictureGameWon = 'img/You won, you lost/You won A.png';

    button = {
        x: 0,
        y: 0,
        width: 220,
        height: 60
    };

    constructor(type, score, onRestart) {
        super();
        this.type = type; // "lost" or "won"
        this.score = score;
        this.onRestart = onRestart;
        if (type === "lost") {
            this.loadImage(this.pictureGameOver);
        } else {
            this.loadImage(this.pictureGameWon);
        }
        this.width = canvas.width;
        this.height = canvas.height;
        this.button.x = canvas.width / 2 - 110;
        this.button.y = canvas.height / 2 + 120;
        this.x = 0;
        this.y = 0;
    }

    draw(ctx) {
        // black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // image centered
        ctx.drawImage(this.img,
            canvas.width / 2 - 300,
            canvas.height / 2 - 200,
            600,
            400
        );
        // score text
        if (this.type === "won") {
            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.fillText(
                "Score: " + this.score,
                canvas.width / 2 - 100,
                canvas.height / 2 + 250
            );
        }
        // button
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            this.button.x,
            this.button.y,
            this.button.width,
            this.button.height
        );

        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(
            "Play Again",
            this.button.x + 30,
            this.button.y + 40
        );
    }
    isButtonClicked(x, y){
    return (
        x >= this.button.x &&
        x <= this.button.x + this.button.width &&
        y >= this.button.y &&
        y <= this.button.y + this.button.height
    );
}
}


