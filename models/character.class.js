class Character extends MovableObject {
    height = 250;
    y = 95;
    speed = 10;
    bottleCount = 0;
    coinCount = 0;
    heartCount = 0;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png'
    ]

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ]

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ]

    world;

    constructor(audio) {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.audio = audio;
    }

    /**
     * function for animating the character in the right way, all the pictures and also the functionalities are being displayed 
     * in 60 fps i.e 1000/60
     */
    update() {
        const k = this.world.keyboard;
        if (this.isAboveGround() || this.speedY > 0) { this.y -= this.speedY; this.speedY -= this.acceleration; }
        if (k.RIGHT) { this.moveRight(); this.otherDirection = false; }
        if (k.LEFT && this.x > 0) { this.moveLeft(); this.otherDirection = true; }
        if (k.UP && !this.isAboveGround()) { this.jump();}
        this.world.camera_x = -this.x + 100;
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAboveGround()) return this.playAnimation(this.IMAGES_JUMPING);
        if (k.RIGHT || (k.LEFT && this.x > 0)) this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * setting the speed on the Y achis to 25 making the character "jump"
     */
    jump() {
        this.speedY = 25;
    }
}