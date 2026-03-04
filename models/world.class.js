class World {
    character = new Character();
    ctx;
    canvas; // ova canvas varijabla je potrebna pri clear animation frame, potrebna je tako sto se kod svakog frame-a istovremeno
    // ekran mora ocistiti i opet crtati
    keyboard;
    camera_x = 0; // varijabla za pomicanje svijeta
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarFlask = new StatusBarFlask();
    bossStatusBar = new StatusBar();
    gameEnded = false;
    endScreen = null;
    throwableObjects = [];
    phoneKeys;

    constructor(canvas, keyboard) {
        this.level = level1;
        this.bossStatusBar = new StatusBar();
        this.bossStatusBar.width = 150;
        this.bossStatusBar.height = 40;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // sa ovim se onda uvodi u pricu nova varijabla imena canvas
        this.keyboard = keyboard;
        this.phoneKeys = new Phone(this.keyboard, this.canvas, this);
        this.setWorld();
        this.start();
        this.draw();
        this.run();
    }

    /**
     * Starts the world game loop and anything on it with the desired frame rate ~60 fps, synching all of the characters for a smoother 
     * gameplay
     */
    start() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);
    }

    /**
     * One main global animation that syncs all the characters ingame to ~60fps
     */
    update() {
        this.character.update();
        if (this.character.energy <= 0) {
            this.endGame("lost");
        }
        this.level.enemies.forEach(enemy => {
            enemy.update();
        });
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.shouldBeRemoved);
        this.level.enemiesSmall.forEach(enemySmall => {
            enemySmall.update()
        });
        this.level.enemiesSmall = this.level.enemiesSmall.filter(enemySmall => !enemySmall.shouldBeRemoved);
        this.throwableObjects.forEach(bottle => {
            bottle.applyGravity();
            bottle.update();
        });

        if (this.level.enemies.length === 0 &&
            this.level.enemiesSmall.length === 0 &&
            this.level.endboss) {
            this.level.endbossActive = true;
        }
        if (this.level.endbossActive) {
            this.level.endboss.update();
        }
        if (
            this.level.endbossActive &&
            this.level.endboss.energy <= 0
        ) {
            this.endGame("won");
        }
    }

    /**
     * Function needed for the character to be able to run
     */
    run() {
        this.intervalRun = setInterval(() => {
            this.checkCollisions();
            this.checkBottleCollection();
            this.checkThrowableObjects();
            this.checkBottleCollisions();
            this.checkCoinCollection();
            this.checkHeartCollection();
        }, 200);
    }

    /**
     * Needed for game optimization, otherwise the intervals are never stoped, therefore game gets extremly laggy
     */
    stop() {
        clearInterval(this.intervalRun);
    }

    /**
     * Imports Bottles as an array 
     */
    checkThrowableObjects() {
        if (this.keyboard.SPACE && this.character.bottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.bottleCount--;
            this.statusBarFlask.setPercentage(this.character.bottleCount * 20);
        }
    }

    /**
     * Checks if the player itself colided with the enemy(if yes jump and "kill" the enemy(ONLY FROM THE TOP)) if you touch the enemy
     * health from the character gets deducted
     */
    checkCollisions() {
        this.level.getAllEnemies().forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                if (this.character.y + this.character.height - 20 < enemy.y) {
                    enemy.hit();
                    this.character.jump();
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });
    }

    /**
     * Check if character collides with ground bottles
     * If collision detected:
     *   - Add to character.bottleCount
     *   - Cap at 5 bottles max (100%)
     *   - Update status bar
     *   - Remove bottle from game
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle, index) => {
            this.level.getAllEnemies().forEach(enemy => {
                if (bottle.isColliding(enemy)) {
                    enemy.hit();
                    bottle.splashBottle();
                }
            });
            if (this.level.endbossActive) {
                if (bottle.isColliding(this.level.endboss)) {
                    this.level.endboss.hit();
                    bottle.splashBottle();
                }
            }
            bottle.checkCollisionWithGround();
            if (bottle.isSplashComplete()) {
                this.throwableObjects.splice(index, 1);
            }
        });
    }
    /**
     * Check if character collides with ground bottles
     * If collision detected:
     *   - Add to character.bottleCount
     *   - Cap at 5 bottles max (100%)
     *   - Update status bar
     *   - Remove bottle from game
     */
    checkBottleCollection() {
        this.level.groundBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottleCount++;
                if (this.character.bottleCount > 5) {
                    this.character.bottleCount = 5;
                }
                this.statusBarFlask.setPercentage(this.character.bottleCount * 20);
                this.level.groundBottles.splice(index, 1);
            }
        });
    }

    /**
     * Check if character collides with coins
     * If collision detected:
     *   - Add to character.coinCount
     *   - Cap at 5 coins max (100%)
     *   - Update status bar
     *   - Remove coin from game
     */
    checkCoinCollection() {
        this.level.coin.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coinCount++;
                if (this.character.coinCount > 5) {
                    this.character.coinCount = 5;
                }
                this.statusBarCoin.setPercentage(this.character.coinCount * 20);
                this.level.coin.splice(index, 1);
            }
        })
    }

    /**
     * Check if character collides with hearts
     * If collision detected:
     * the user gets 20 energy and the bar gets updated
     * if the user already has 100% health, the heart gets erased
     * 
     */
    checkHeartCollection() {
        this.level.heart.forEach((heart, index) => {
            if (this.character.isColliding(heart)) {
                this.character.energy += 20;
                if (this.character.energy > 100) {
                    this.character.energy = 100;
                }
                this.statusBar.setPercentage(this.character.energy);
                this.level.heart.splice(index, 1);
            }
        })
    }

    endGame(type) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        clearInterval(this.gameLoop);
        clearInterval(this.intervalRun);
        this.endScreen = new EndGame(
            type,
            this.character.coinCount,
            () => this.restartGame(),
            () => this.mainMenu());
        this.handleEndClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const clicked = this.endScreen.getClickedButton(x, y);
            if (clicked === "playAgain") {
                this.endScreen.onRestart();
            }
            if (clicked === "mainMenu") {
                this.endScreen.onMainMenu();
            }
        };
        canvas.addEventListener("click", this.handleEndClick);
    }

    restartGame() {
        // remove click listener
        canvas.removeEventListener("click", this.handleEndClick);
        showMenu = false;
        world = new World(canvas, keyboard);
    }

    mainMenu() {
        canvas.removeEventListener("click", this.handleEndClick);
        clearInterval(this.gameLoop);
        clearInterval(this.intervalRun);
        showMenu = true;
        if (menu) menu.destroy();
        world = null;
        menu = new Menu(canvas);
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        if (this.gameEnded) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.endScreen.draw(this.ctx);
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectstoMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0); // potrebno tako da status bar ostaje uvijek sa igracem okrenuti
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarFlask);
        this.ctx.translate(this.camera_x, 0); // i potrebno je opet vratiti na svoje mjesto 
        this.addToMap(this.character);
        if (this.level.endbossActive) {
            this.addToMap(this.level.endboss);
            this.bossStatusBar.x = this.level.endboss.x;
            this.bossStatusBar.y = this.level.endboss.y - 40;
            let percentage =
                (this.level.endboss.energy / this.level.endboss.maxEnergy) * 100;
            this.bossStatusBar.setPercentage(percentage);
            this.addToMap(this.bossStatusBar);
        }
        this.addObjectstoMap(this.level.clouds);
        this.addObjectstoMap(this.level.groundBottles);
        this.addObjectstoMap(this.level.coin);
        this.addObjectstoMap(this.level.heart);
        this.addObjectstoMap(this.level.enemies);
        this.addObjectstoMap(this.level.enemiesSmall);
        this.addObjectstoMap(this.throwableObjects);
        this.phoneKeys.draw(this.ctx);
        this.ctx.translate(-this.camera_x, 0);
    };

    /**
     * 
     * @param {parameter} objects 
     * @returns objects added to the map
     */
    addObjectstoMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        })
    }

    /**
     * 
     * @param {parameter} mo 
     * @returns objects added to the map, with the switching of the images when the user runs in other direction
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * 
     * @param {event} mo 
     * @returns flips the image of the character for a more natural look
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * - 1; // potrebno jer ctx.translate ne funkcionise bas kako se pise, tako da se sirina objekta mora manipuilisati
    }

    /**
     * 
     * @param {event} mo 
     * @returns flips the image back of the character for a more natural look
     */
    flipImageBack(mo) {
        mo.x = mo.x * - 1;
        this.ctx.restore();
    }

}