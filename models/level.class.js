class Level{
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 1530;
    groundBottles;
    coin;
    enemiesSmall;
    endboss;
    endbossActive = false;

    constructor(enemies,clouds,backgroundObjects,groundBottles = [], coin = [],enemiesSmall = [], endboss = null){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.groundBottles = groundBottles;
        this.coin = coin;
        this.enemiesSmall = enemiesSmall;
        this.endboss = endboss;
        this.endbossActive = false;
    }

    
    getAllEnemies() {
        const bosses = this.endboss ? [this.endboss] : [];
        return [...this.enemies, ...this.enemiesSmall, ...bosses];
    }

}