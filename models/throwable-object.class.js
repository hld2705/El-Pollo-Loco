class ThrowableObject extends MovableObject {

    IMAGES_BOTTLE_ROTATING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    IMAGES_BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    isSplashing = false;
    splashAnimationCounter = 0;
    hasCollided = false;
    throwInterval;

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATING);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.loadImages(this.IMAGES_BOTTLE_GROUND);
        this.x = x;
        this.randomSpawn = Math.random() * 300;
        this.y = y;
        this.height = 100;
        this.width = 70;
        this.throw();
    }

    /**
     * changing the interval of the x achsis and registering the applyGravity function
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.throwIntervalBottle = setInterval(() => {
            if (!this.isSplashing) {
                this.x += 10;
            }
        }, 25);
    }

    update() {
        if (this.isSplashing) {
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            this.splashAnimationCounter++;
        } else if (!this.isAboveGround()) {
            this.playAnimation(this.IMAGES_BOTTLE_GROUND);
        } else {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATING);
        }
    }

    /**
         * Called from World.checkBottleCollisions()
         * Triggers when bottle hits the ground (y position reaches 480 or lower)
         */
    checkCollisionWithGround() {
        if (!this.isAboveGround() && !this.isSplashing && !this.hasCollided) {
            this.hasCollided = true;
            this.isSplashing = true;
            this.speedY = 0;
            clearInterval(this.throwInterval);
        }
    }

    /**
     * Called from World.checkBottleCollisions() when bottle hits an enemy
     * Triggers the splash animation immediately
     */
    splashBottle() {
        if (!this.isSplashing && !this.hasCollided) {
            this.hasCollided = true;
            this.isSplashing = true;
            this.speedY = 0;
            clearInterval(this.throwInterval);
        }
    }

    /**
     * Checks if the splash animation has completed
     * Used by World to know when to remove the bottle from the game
     * @returns {boolean} true if splash animation is complete
     */
    isSplashComplete() {
        return this.isSplashing && this.splashAnimationCounter >= this.IMAGES_BOTTLE_SPLASH.length;
    }

    /**
     * 
     * @returns y-achse to the end of the screen, if not the bottle continues to travel on the y-achse
     */
    isAboveGround() {
        return this.y < 480;
    }


}