class Level{
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 1530;
    groundBottles;

    constructor(enemies,clouds,backgroundObjects,groundBottles = []){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.groundBottles = groundBottles;
    }
}