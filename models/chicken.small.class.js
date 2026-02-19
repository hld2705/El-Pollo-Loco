class SmallChicken extends MovableObject {

    height = 80;
    width = 60;
    y = 170;

    IMAGES_CHICKEN_SMALL_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ]

    IMAGES_CHICKEN_SMALL_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ]

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png')
        this.loadImages(this.IMAGES_CHICKEN_SMALL_WALKING)
        this.loadImages(this.IMAGES_CHICKEN_SMALL_DEAD)
        this.x = 600 + Math.random() * 500;
        this.speed = 0.30 + Math.random() * 0.5;
        this.energy = 5;
        this.groundY = 180;
        this.y = this.groundY;
        this.shouldBeRemoved = false;
        this.startJumpingInterval();
    }

    /**
     * Makes the small chicken jump at random intervals
     */
    startJumpingInterval() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_CHICKEN_SMALL_DEAD);
                this.speed = 0;
            } else{
                this.jump();
            }
        }, 2000 + Math.random() * 2000); // Jumps every 2-4 seconds randomly
    }

    update() {
        this.applyGravity();
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_CHICKEN_SMALL_DEAD);
            this.speed = 0;
            setTimeout(() => {
                this.shouldBeRemoved = true;
            }, 2000);
        } else {
            this.moveLeft();
            this.playAnimation(this.IMAGES_CHICKEN_SMALL_WALKING);
        }
    }

}