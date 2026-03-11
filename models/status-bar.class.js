class StatusBar extends DrawableObject {

    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 0;
        this.width = 250;
        this.height = 70;
        this.setPercentage(100);
    }

    /**
     * Sets the percentage of the health
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Counts the health of the character
     */
 resolveImageIndex() {
    if (this.percentage == 100) {
        return 5;
    } else if (this.percentage >= 80) {
        return 4;
    } else if (this.percentage >= 60) {
        return 3;
    } else if (this.percentage >= 40) {
        return 2;
    } else if (this.percentage >= 20) {
        return 1;
    } else {
        return 0;
    }
}

}

