class PickableBottle extends DrawableObject {
    IMAGES_BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    currentImageIndex = 0;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLE_GROUND);
        this.y = y;
        this.x = x;
        this.width = 70;
        this.height = 100;
        this.displayImage();
        this.startAnimation();
    }

    /**
     * Display current image based on currentImageIndex
     */
    displayImage() {
        let path = this.IMAGES_BOTTLE_GROUND[this.currentImageIndex];
        this.img = this.imageCache[path];
    }

    /**
     * Animate between the two bottle images to create pulsing effect
     * This helps player notice bottles on the ground
     */
    startAnimation() {
        setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_BOTTLE_GROUND.length;
            this.displayImage();
        }, 500);
    }
}