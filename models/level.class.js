class Level {
    enemies;
    clouds;
    backgroundObjects;
    groundBottles;
    coin;
    heart;
    enemiesSmall;
    endboss;
    endbossActive = false;

    constructor(enemies, clouds, backgroundObjects, groundBottles = [], coin = [], enemiesSmall = [], heart = [], endboss = null) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.groundBottles = groundBottles;
        this.coin = coin;
        this.heart = heart;
        this.enemiesSmall = enemiesSmall;
        this.endboss = endboss;
        this.endbossActive = false;
    }
    /**
     * Helper function needed for differenting enemies (boss spawns only then when all "small" enemies are defeated)
     */
    getAllEnemies() {
        const bosses =
            this.endboss && this.endbossActive
                ? [this.endboss]
                : [];
        return [...this.enemies, ...this.enemiesSmall, ...bosses];
    }

    /**
     * Helper function needed for the "Play Again", "Main Menu" for the flags to be reseted
     */
    resetLevel() {
        this.enemies.forEach(e => this.resetEnemy(e));
        this.enemiesSmall.forEach(e => this.resetEnemy(e));
        if (this.endboss) {
            this.resetEnemy(this.endboss);}
        this.endbossActive = false;
    }

    /**
     * Helper function for setting the flags back to zero
     */
    resetEnemy(e) {
        e.energy = e.maxEnergy;
        e.shouldBeRemoved = false;
        e.currentImage = 0;
        e.lastHit = 0;
    }
}