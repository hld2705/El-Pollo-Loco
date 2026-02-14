class Chicken extends MovableObject {
    height = 100;
    width = 80;
    y = 350;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ]

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.energy = 5;
        this.update();
    }

    /**
     * needed to animate the chickens going left at a constant speed, being spawned by the Math.random() method 
     */
   update() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.speed = 0;
        } else {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}