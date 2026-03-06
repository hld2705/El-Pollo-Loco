class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applys gravity on the character so when jumping the character falls down
     */
    applyGravity() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.y > 350) {
            this.y = 350;
            this.speedY = 0;}
    }

    /**
     * @returns Returns the value so it disables the posibility of double jumping inside game
     */
    isAboveGround() {
        return this.y < 180;
    }

     /**
     * Helper function for moving right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Helper function for moving left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * @param {Object} images 
     * Loads the images inside the imageChache and plays the needed animations
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Helper function for jumps
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Helper function for registering hits
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * 
     * @returns if the energy of the character reaches 0
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * 
     * @returns registers hits on a character 
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * 
     * @param {event} mo 
     * @returns calculates on the principle of a the axis if the character is actually touching another object, added 3px of padding to enlarge the hitboxes
     */
    isColliding(mo) {
        const padding = 3;
        return this.x < mo.x + mo.width + padding &&
            this.x + this.width > mo.x - padding &&
            this.y < mo.y + mo.height + padding &&
            this.y + this.height > mo.y - padding;
    }
}