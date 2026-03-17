class Phone extends MovableObject {

    IMAGES_ARROW = [
        'img/arrow-left.svg',
        'img/arrow-right.svg',
        'img/arrow-up.svg',
        'img/space-key.svg'
    ]

    IMAGES_SOUND = [
        'img/sound-max.svg',
        'img/sound-mute.svg'
    ]

    IMAGES_FULLSCREEN = [
        'img/fullscreen.svg',
        'img/fullscreen-exit.svg'
    ]

    constructor(keyboard, canvas, world) {
        super();
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.world = world;
        this.size = 50;
        this.buttons = {};
        this.init();
        this.soundMuted = false;
        this.syncSoundIcon();
    }

    /**
     * function for initializing the functions
     */
    init() {
        this.createButtons();
        this.addListeners();
    }

    /**
     * function that creates "draws" the buttons and adds their function using the keyboard assigned keys
     */
    createButtons() {
        this.buttons = {
            left: { img: this.loadImage(this.IMAGES_ARROW[0]), press: () => this.keyboard.LEFT = true },
            right: { img: this.loadImage(this.IMAGES_ARROW[1]), press: () => this.keyboard.RIGHT = true },
            up: { img: this.loadImage(this.IMAGES_ARROW[2]), press: () => this.keyboard.UP = true },
            space: { img: this.loadImage(this.IMAGES_ARROW[3]), press: () => this.keyboard.SPACE = true },
            fullscreen: { img: this.loadImage(this.IMAGES_FULLSCREEN[0]), press: () => this.toggleFullscreen() },
            sound: { img: this.loadImage(this.IMAGES_SOUND[0]), press: () => this.toggleSound() }
        };
    }

    /**
     * Event listeners for click, touch etc..
     */
    addListeners() {
        this.pointerDownHandler = (e) => this.handleEvent(e, 'press');
        this.pointerUpHandler = () => this.resetKeys();
        this.pointerCancelHandler = () => this.resetKeys();
        this.canvas.addEventListener('pointerdown', this.pointerDownHandler);
        this.canvas.addEventListener('pointerup', this.pointerUpHandler);
        this.canvas.addEventListener('pointercancel', this.pointerCancelHandler);
    }

    /**
     * Function needed to destroy all of the listeners
     */
    destroy() {
        if (this.pointerDownHandler) this.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
        if (this.pointerUpHandler) this.canvas.removeEventListener('pointerup', this.pointerUpHandler);
        if (this.pointerCancelHandler) this.canvas.removeEventListener('pointercancel', this.pointerCancelHandler);
    }
    /**
     * Helper function for registering the click
     */
    handleEvent(e, type) {
        const pos = this.getMousePos(e);
        for (let key in this.buttons) {
            const btn = this.buttons[key];
            if (this.isInside(pos, btn) && btn[type]) btn[type]();
        }
    }

    /**
     * Helper function needed so that a desktop user can also click on the individual buttons themself
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX - (this.world?.camera_x || 0),
            y: (e.clientY - rect.top) * scaleY
        };
    }

    /**
     * Resets the state of the buttons
     */
    resetKeys() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
    }

    /**
     * Returns the needed info on clicked buttons
     */
    updatePositions() {
        if (!this.world?.character) return;
        const c = this.world.character;
        const ground = this.world.level?.groundY || this.canvas.height - 140;
        const cx = c.x + c.width / 2;
        const top = ground - this.size - 10;
        const gap = 38;
        this.setPos('left', cx - this.size - gap, top + 120);
        this.setPos('right', cx + gap, top + 120);
        this.setPos('up', cx - this.size / 2, top + 70);
        this.setPos('space', cx + this.size + gap * 5, top + 120);
        this.setPos('fullscreen', cx + 458, top - 250);
        this.setPos('sound', cx + 408, top - 250);
    }

    /**
     * Setting the position of the buttons
     */
    setPos(name, x, y) {
        this.buttons[name].x = x;
        this.buttons[name].y = y;
        this.buttons[name].width = this.size;
        this.buttons[name].height = this.size;
    }

    /**
     * Helper function for syncing the sound icon, when its muted and game reloaded the icon gets carried over
     */
    syncSoundIcon() {
        this.soundMuted = this.world.audio.muted;
        if (this.soundMuted) {
            this.buttons.sound.img = this.loadImage(this.IMAGES_SOUND[1]);
        } else {
            this.buttons.sound.img = this.loadImage(this.IMAGES_SOUND[0]);
        }
    }

    /**
     * checks whether a point is inside a rectangular button area
     */
    isInside(pos, btn) {
        return pos.x >= btn.x &&
            pos.x <= btn.x + btn.width &&
            pos.y >= btn.y &&
            pos.y <= btn.y + btn.height;
    }

    /**
     * Main draw function
     */
    draw(ctx) {
        this.updatePositions();
        for (let key in this.buttons) this.drawButton(ctx, this.buttons[key]);
    }

    /**
     * Helper function for drawing the images of the buttons
     */
    loadImage(path) {
        let img = new Image();
        img.src = path;
        return img;
    }

    /**
     * Helper function for drawing the buttons
     */
    drawButton(ctx, b) {
        ctx.drawImage(b.img, b.x, b.y, b.width, b.height);
    }

    /**
     * Toggles fullscreen mode
     */
    toggleFullscreen() {
        if (document.fullscreenElement === this.canvas) {
            document.exitFullscreen();
            this.buttons.fullscreen.img = this.loadImage(this.IMAGES_FULLSCREEN[0]);
        } else {
            this.canvas.requestFullscreen();
            this.buttons.fullscreen.img = this.loadImage(this.IMAGES_FULLSCREEN[1]);
        }
    }

    /**
    * Changes the icon and mutes the sound of the game
    */
    toggleSound() {
    this.world.audio.toggleMute();
    this.syncSoundIcon();
}
}