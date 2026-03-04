class Phone extends MovableObject {

    constructor(keyboard, canvas, world) {
        super();
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.world = world;
        this.buttonSize = 50;
        this.padding = 10;
        this.buttons = {};
        this.setupClickListener();
    }

    setupClickListener() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left - (this.world ? this.world.camera_x : 0);
            const clickY = e.clientY - rect.top;
            this.checkButtonClick(clickX, clickY);});
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left - (this.world ? this.world.camera_x : 0);
            const clickY = e.clientY - rect.top;
            this.checkButtonPress(clickX, clickY);});
        this.canvas.addEventListener('mouseup', () => {
            this.keyboard.LEFT = false;
            this.keyboard.RIGHT = false;
            this.keyboard.UP = false;
            this.keyboard.SPACE = false;});
    }

    updateButtonPositions() {
        if (!this.world || !this.world.character) return;
        const c = this.world.character;
        const plantedY = (this.world.level && this.world.level.groundY) ? this.world.level.groundY : (this.canvas.height - 140);
        const centerX = c.x + c.width / 2;
        const topY = plantedY - this.buttonSize - 10;
        this.buttons.up = { x: centerX - this.buttonSize / 2, y: topY, width: this.buttonSize, height: this.buttonSize };
        const sideY = topY + Math.round(this.buttonSize * 0.6);
        const gap = 38;
        this.buttons.left = { x: centerX - this.buttonSize - gap, y: sideY +50, width: this.buttonSize, height: this.buttonSize  };
        this.buttons.right = { x: centerX + gap, y: sideY +50, width: this.buttonSize, height: this.buttonSize };
        this.buttons.space = { x: centerX + this.buttonSize + gap * 2, y: sideY + Math.round(this.buttonSize * 0.2) +50, width: this.buttonSize + 10, height: this.buttonSize };
        this.buttons.fullscreen = { x: centerX + this.buttonSize + 458, y: topY - Math.round(this.buttonSize * 0.9) - 200, width: this.buttonSize - 6, height: this.buttonSize - 6 };
        this.buttons.sound = { x: centerX - this.buttonSize - (this.buttonSize - 6) + 458, y: topY - Math.round(this.buttonSize * 0.9) - 200, width: this.buttonSize - 6, height: this.buttonSize - 6 };
    }

    checkButtonClick(clickX, clickY) {
        if (this.isClickInButton(clickX, clickY, this.buttons.fullscreen)) {
            this.toggleFullscreen();}
        if (this.isClickInButton(clickX, clickY, this.buttons.sound)) {
            this.toggleSound();
        }
    }

    checkButtonPress(clickX, clickY) {
        if (this.isClickInButton(clickX, clickY, this.buttons.left)) {
            this.keyboard.LEFT = true;}
        if (this.isClickInButton(clickX, clickY, this.buttons.right)) {
            this.keyboard.RIGHT = true;}
        if (this.isClickInButton(clickX, clickY, this.buttons.up)) {
            this.keyboard.UP = true;}
        if (this.isClickInButton(clickX, clickY, this.buttons.space)) {
            this.keyboard.SPACE = true;}
    }

    isClickInButton(clickX, clickY, button) {
        return clickX >= button.x && 
               clickX <= button.x + button.width && 
               clickY >= button.y && 
               clickY <= button.y + button.height;
    }

    draw(ctx) {
        this.updateButtonPositions();
        this.drawButton(ctx, this.buttons.left, '←', 'arrow-left');
        this.drawButton(ctx, this.buttons.right, '→', 'arrow-right');
        this.drawButton(ctx, this.buttons.up, '↑', 'arrow-up');
        this.drawButton(ctx, this.buttons.space, 'throw', 'space');
        this.drawButton(ctx, this.buttons.fullscreen, '⛶', 'fullscreen');
        this.drawButton(ctx, this.buttons.sound, '🔊', 'sound');
    }

    drawButton(ctx, button, label) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, button.x + button.width / 2, button.y + button.height / 2);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleSound() {
        console.log('Sound toggled');
    }
}