class Character extends MovableObject {
    height = 250;
    y = 95;
    speed = 10;
    bottleCount = 0;
    coinCount = 0;
    heartCount = 0;

    animationSpeed = {
        WALKING: 120,
        JUMPING: 150,
        IDLE: 220,
        LONG_IDLE: 320,
        HURT: 160,
        DEAD: 200
    };

    lastFrameTime = 0;
    currentImageIndex = 0;

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
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
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

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]

    world;
    lastAction = new Date().getTime();

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
    }

    /**
     * function for animating the character in the right way, all the pictures and also the functionalities are being displayed 
     * in 60 fps i.e 1000/60
     */
    update() {
        this.prevY = this.y;
        let idleTime = (new Date().getTime() - this.lastAction) / 500;
        const k = this.world.keyboard;
        if (this.isAboveGround() || this.speedY > 0) { this.y -= this.speedY; this.speedY -= this.acceleration; }
        const maxX = 1500;
        if (k.RIGHT && this.x < maxX) { this.moveRight(); this.otherDirection = false; this.lastAction = new Date().getTime(); }
        if (k.LEFT && this.x > 0) { this.moveLeft(); this.otherDirection = true; this.lastAction = new Date().getTime(); }
        if (k.UP && !this.isAboveGround()) { this.jump(); this.lastAction = new Date().getTime(); }
        this.world.camera_x = -this.x + 100;
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimationWithSpeed(this.IMAGES_HURT, this.animationSpeed.HURT);
        if (this.isAboveGround()) return this.playAnimationWithSpeed(this.IMAGES_JUMPING, this.animationSpeed.JUMPING);
        if ((k.RIGHT && this.x < maxX) || (k.LEFT && this.x > 0)) this.playAnimationWithSpeed(this.IMAGES_WALKING, this.animationSpeed.WALKING);
        if (idleTime > 1) { return this.playAnimationWithSpeed(this.IMAGES_LONG_IDLE, this.animationSpeed.LONG_IDLE); }
        if (idleTime > 0.5) { return this.playAnimationWithSpeed(this.IMAGES_IDLE, this.animationSpeed.IDLE); }
    }

    /**
     * Function for regulating the character animation speeds, all of the different states are animated on different speeds
     * to make the game a bit more natural
     */
    playAnimationWithSpeed(images, speed) {
        const now = Date.now();
        if (now - this.lastFrameTime > speed) {
            this.currentImageIndex++;
            if (this.currentImageIndex >= images.length) {
                this.currentImageIndex = 0;}
            this.img = this.imageCache[images[this.currentImageIndex]];
            this.lastFrameTime = now;
        }
    }

    /**
     * setting the speed on the Y achis to 25 making the character "jump"
     */
    jump() {
        this.speedY = 25;
    }
}