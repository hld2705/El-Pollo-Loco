class Heart extends DrawableObject {

    IMAGE_HEART = [
        'img/heart-health.png',
    ]

    constructor(x, y) {
        super()
        this.loadImage(this.IMAGE_HEART);
        this.y = y;
        this.x = x;
        this.width = 50;
        this.height = 60;
    }

    /**
     * Loads the image inside the cache, and updates the index of the counter
     */
    update() {
        let path = this.IMAGE_COIN[this.currentImageIndex];
        this.img = this.imageCache[path];
    }
}