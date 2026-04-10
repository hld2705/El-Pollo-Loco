class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;
    maxEnergy = 100;
    lastHit = 0;
    isDeadAnimationPlayed = false;
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ]

    constructor() {
        super()
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.playAnimation(this.IMAGES_WALKING);
        this.x = 1200;
        this.animationCounter = 0;
        this.animationSpeed = 8;
    }

    /**
     * needed for the initialization of the images of the endboss
     */
    update(character) {
        this.animationCounter++;
        this.speed = 1.68;
        if (this.energy <= 0) { this.handleDeath();} else if (this.isRecentlyHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.speed = 1.70;
        } else if (character) { const dx = character.x - this.x;
            if (dx < -10) { this.moveLeft(); this.otherDirection = false;
            } else if (dx > 10) { this.moveRight(); this.otherDirection = true; }
            if (this.animationCounter % this.animationSpeed === 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    }

/**
 * @returns Can only be struck with a bottle, needs two hits to be dead
 */
isRecentlyHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 600;
}

/**
 * If EndBoss is dead the animation is going to be played which proceeds with the gameover endscreen
 */
handleDeath() {
    if (!this.isDeadAnimationPlayed) {
        this.playAnimation(this.IMAGES_DEAD);
        this.isDeadAnimationPlayed = true;
        setTimeout(() => {
            this.shouldBeRemoved = true;
        }, 2000);
    }
}

/**
 * Endboss registers hit
 */
hit() {
    if (this.energy <= 0) return;
    this.energy -= 20;
    this.lastHit = new Date().getTime();
    if (this.energy < 0) {
        this.energy = 0;
    }
}

}