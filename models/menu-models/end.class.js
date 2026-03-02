class EndGame extends DrawableObject {

    pictureGameOver = 'img/You won, you lost/Game Over.png';
    pictureGameWon = 'img/You won, you lost/You won A.png';

    buttons = {
        playAgain: { x: 0, y: 0, width: 180, height: 45 },
        mainMenu: { x: 0, y: 0, width: 180, height: 45 }
    };

    constructor(type, score, onRestart, onMainMenu) {
        super();
        this.type = type;
        this.score = score;
        this.onRestart = onRestart;
        this.onMainMenu = onMainMenu;
        this.loadImage(
            type === "lost" ? this.pictureGameOver : this.pictureGameWon
        );
        const rightX = canvas.width * 0.65;
        const centerY = canvas.height / 2;
        // Buttons
        this.buttons.playAgain.x = rightX;
        this.buttons.playAgain.y = centerY + 10;
        this.buttons.mainMenu.x = rightX;
        this.buttons.mainMenu.y = centerY + 80;
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // LEFT: image
        ctx.drawImage(
            this.img,
            canvas.width * 0.1,
            canvas.height / 2 - 200,
            350,
            350
        );

        // RIGHT: score
        if (this.type === "won") {
            ctx.fillStyle = "white";
            ctx.font = "32px Arial";
            ctx.textAlign = "left";
            ctx.fillText(
                "Coins collected: " + this.score,
                canvas.width * 0.6,
                canvas.height / 2 - 120
            );
        }

        // Buttons
        this.drawButton(ctx, this.buttons.playAgain, "Play Again");
        this.drawButton(ctx, this.buttons.mainMenu, "Main Menu");
    }

    drawButton(ctx, btn, text) {
        ctx.fillStyle = "#FFDD00";
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            text,
            btn.x + btn.width / 2,
            btn.y + 28
        );
    }

    getClickedButton(x, y) {
        if (this.isInside(this.buttons.playAgain, x, y)) return "playAgain";
        if (this.isInside(this.buttons.mainMenu, x, y)) return "mainMenu";
        return null;
    }

    isInside(btn, x, y) {
        return (
            x >= btn.x &&
            x <= btn.x + btn.width &&
            y >= btn.y &&
            y <= btn.y + btn.height
        );
    }

}


