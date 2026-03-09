class Coin extends DrawableObject {

    IMAGE_COIN = [
        'img/8_coin/coin_1.png',
    ]

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGE_COIN);
        this.y = y;
        this.x = x;
        this.width = 170;
        this.height = 200;
    }

    /**
     * Updates the status bar and the index by loading the imageCache
     */
    update() {
        let path = this.IMAGE_COIN[this.currentImageIndex];
        this.img = this.imageCache[path];
    }

}