class Phone extends MovableObject {

    constructor(keyboard, canvas, world) {
        super();
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.world = world;
        this.size = 50;
        this.buttons = {};
        this.domListeners = [];
        this.init();
        this.soundMuted = false;
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.controlsEnabled = false;
        this.fullscreenListener = this.onFullscreenChange.bind(this);
        this.resizeListener = this.checkAndShowMobileButtons.bind(this);
        this.orientationListener = this.checkAndShowMobileButtons.bind(this);
        document.addEventListener('fullscreenchange', this.fullscreenListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('orientationchange', this.orientationListener);
        this.checkAndShowMobileButtons();
    }

    /**
     * Renders the buttons again after screen change on fullscreen mode
     */
    onFullscreenChange() {
        const container = document.getElementById("game-container");
        if (document.fullscreenElement) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            container.style.width = "100vw";
            container.style.height = "100vh";
        } else {
            this.canvas.width = 720;
            this.canvas.height = 480;
            container.style.width = "fit-content";
            container.style.height = "auto";
        }
        this.checkAndShowMobileButtons();
    }

    /**
     * function for initializing the functions
     */
    init() {
        this.addListeners();
        this.setupMobileControls(this.keyboard, this.world);
    }

    /**
     * Function for checking when the mobile phone is tilted and not, also when the user wins or looses to show/hide the buttons
     */
    checkAndShowMobileButtons() {
        const isResponsive = window.innerWidth < 900;
        const isLandscape = window.innerWidth > window.innerHeight;
        const shouldShowMovement = (isResponsive && isLandscape) || document.fullscreenElement;
        const topControls = document.getElementById('top-controls');
        if (topControls) { topControls.style.display = 'flex'; }
        ['left-controls', 'right-controls'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = shouldShowMovement ? 'flex' : 'none';
            }
        });
    }

    /**
     * A small delay function for delaying the phone keys after the world is created to prevent mistype 
     */
    enableControlsWithDelay(delay = 2000) {
        this.resetKeys();
        this.controlsEnabled = false;
        setTimeout(() => {
            this.controlsEnabled = true;
        }, delay);
    }

    /**
     * Function that assignes the HTML keys and its functions using pointerups and downs, also chaging the sound and fullscreen icons
     */
    setupMobileControls() {
        const map = { 'btn-left': 'LEFT', 'btn-right': 'RIGHT', 'btn-up': 'UP', 'btn-space': 'SPACE' };
        for (let id in map) {
            const el = document.getElementById(id);
            if (!el) continue;
            const down = e => { if (!this.controlsEnabled) return; e.preventDefault(); this.keyboard[map[id]] = true; el.setPointerCapture(e.pointerId); };
            const up = () => this.keyboard[map[id]] = false;
            ['pointerdown', 'pointerup', 'pointercancel', 'lostpointercapture']
                .forEach((t, i) => el.addEventListener(t, i ? up : down));
            this.domListeners.push({ target: el, type: 'pointerdown', fn: down });
            this.domListeners.push({ target: el, type: 'pointerup', fn: up });
            this.domListeners.push({ target: el, type: 'pointercancel', fn: up });
            this.domListeners.push({ target: el, type: 'lostpointercapture', fn: up });
        }

        this.topButtonsDelay();
    }

    /**
     * Delays intentionally the top buttons of the screen preventing misclick
     */
    topButtonsDelay() {
        setTimeout(() => {
            [['btn-fullscreen', () => this.toggleFullscreen()],
            ['btn-sound', () => this.toggleSound()]]
                .forEach(([id, fn]) => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.addEventListener('click', fn);
                    this.domListeners.push({ target: el, type: 'click', fn });
                });
        }, 1000);
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
        this.resetKeys();
        if (this.pointerDownHandler)
            this.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
        if (this.pointerUpHandler)
            this.canvas.removeEventListener('pointerup', this.pointerUpHandler);
        if (this.pointerCancelHandler)
            this.canvas.removeEventListener('pointercancel', this.pointerCancelHandler);
        if (this.fullscreenListener)
            document.removeEventListener('fullscreenchange', this.fullscreenListener);
        if (this.resizeListener)
            window.removeEventListener('resize', this.resizeListener);
        if (this.orientationListener)
            window.removeEventListener('orientationchange', this.orientationListener);
        this.domListeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
        this.domListeners = [];
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
     * Setting the position of the buttons
     */
    setPos(name, x, y) {
        this.buttons[name].x = x;
        this.buttons[name].y = y;
        this.buttons[name].width = this.size;
        this.buttons[name].height = this.size;
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
     * Toggles fullscreen mode
     */
    toggleFullscreen() {
        const img = document.getElementById("img-fullscreen");
        if (document.fullscreenElement) {
            document.exitFullscreen();
            img.src = "img/fullscreen.svg";
        } else {
            this.canvas.requestFullscreen();
            img.src = "img/fullscreen-exit.svg";
        }
    }

    /**
    * Changes the icon and mutes the sound of the game
    */
    toggleSound() {
        this.world.audio.toggleMute();
        const img = document.getElementById("img-sound");
        if (this.world.audio.muted) {
            img.src = "img/sound-mute.svg";
        } else {
            img.src = "img/sound-max.svg";
        }
    }


    /**
     * Hides the mobile control buttons
     */
    hideMobileButtons() {
        const containers = ['left-controls', 'right-controls', 'top-controls'];
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }


}