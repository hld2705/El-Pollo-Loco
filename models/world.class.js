class World {
    constructor(canvas, keyboard, audio) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.character = new Character();
        this.character.world = this;
        this.statusBar = new StatusBar();
        this.statusBarCoin = new StatusBarCoin();
        this.statusBarFlask = new StatusBarFlask();
        this.bossStatusBar = this.createBossBar();
        this.throwableObjects = [];
        this.phoneKeys = new Phone(this.keyboard, this.canvas, this);
        this.audio = audio;
        this.camera_x = 0;
        this.gameEnded = false;
        this.start();
        this.run();
    }

    /**
     * Boss gets his own health bar, helps with the 
     */
    createBossBar() {
        const bar = new StatusBar();
        bar.width = 150;
        bar.height = 40;
        return bar;
    }

    /**
     * Keeps the game intervals synced in 60fps
     */
    start() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);
    }

    /**
     * Updates the game events
     */
    run() {
        this.intervalRun = setInterval(() => {
            this.checkGameEvents();
        }, 200);
    }

    /**
     * Needed for checking all of the events, multiple functions with similar actions needed for game syncing
     */
    checkGameEvents() {
        this.checkCollisions();
        this.checkCollections();
        this.checkThrowing();
        this.checkBottleHits();
    }

    /**
     * Update function that runs on instant (as soon as the character does something, picks up, hits, or gets hit)
     */
    update() {
        this.updateCharacter();
        this.updateEnemies();
        this.updateBoss();
        this.updateBottles();
    }

    /**
     * Needed for triggering the endGame as Lost
     */
    updateCharacter() {
        this.character.update();
        if (this.character.energy <= 0) this.endGame("lost");
    }

    /**
     * When the enemy is dead it stays on the screen for about 2 secs and then gets removed from the screen and also updated
     */
    updateEnemies() {
        this.level.enemies.forEach(e => e.update());
        this.level.enemiesSmall.forEach(e => e.update());
        this.level.enemies =
            this.level.enemies.filter(e => !e.shouldBeRemoved);
        this.level.enemiesSmall =
            this.level.enemiesSmall.filter(e => !e.shouldBeRemoved);
        if (this.level.enemies.length === 0 &&
            this.level.enemiesSmall.length === 0 &&
            this.level.endboss &&
            !this.level.endbossActive) 
            {this.level.endbossActive = true;
            this.audio.playMusic("boss");
        }
    }

    /**
     * Needed to update the health bar from the endboss
     */
    updateBoss() {
        if (!this.level.endbossActive) return;
        this.level.endboss.update();
        if (this.level.endboss.energy <= 0)
            this.endGame("won");
    }

    /**
     * Updates the status bar from the bottle 
     */
    updateBottles() {
        this.throwableObjects.forEach(b => {
            b.applyGravity();
            b.update();
        });
    }

    /**
     * Need to check the remaining enemies left in order to spawn the "EndBoss"
     */
    noEnemiesLeft() {
        return this.level.enemies.length === 0 &&
            this.level.enemiesSmall.length === 0;
    }

    /**
     * Checking collisions with the enemy
     */
    checkCollisions() {
        this.level.getAllEnemies().forEach(enemy => {
            if (!this.character.isColliding(enemy)) return;
            const fromTop = this.character.y + this.character.height - 20 < enemy.y;
            fromTop ? this.killEnemy(enemy) : this.damageCharacter();
        });
    }

    /**
     * Added a small jump when enemy is struck, both to confirm kill (stolen from Mario Bros) and also to "reward" the player 
     */
    killEnemy(enemy) {
        enemy.hit();
        this.character.jump();
    }

    /**
     * Updates the character status bar when hit
     */
    damageCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Needed to register the bottle hits 
     */
    checkBottleHits() {
        this.throwableObjects.forEach((bottle, index) => {
            this.hitEnemiesWithBottle(bottle);
            bottle.checkCollisionWithGround();
            if (bottle.isSplashComplete())
                this.throwableObjects.splice(index, 1);
        });
    }

    /**
     * Hitboxes needed for hitting the enemy with a solsa bottle, and also to display the splash animation
     */
    hitEnemiesWithBottle(bottle) {
        this.level.getAllEnemies().forEach(enemy => {
            if (bottle.isColliding(enemy)) {
                enemy.hit();
                bottle.splashBottle();
            }
        });
        if (this.level.endbossActive &&
            bottle.isColliding(this.level.endboss)) {
            this.level.endboss.hit();
            bottle.splashBottle();
        }
    }

    /**
     * Registers the collection and updates the statusbars
     */
    checkCollections() {
        this.collectItems(this.level.groundBottles, () => {
            this.character.bottleCount = Math.min(5, this.character.bottleCount + 1);
            this.statusBarFlask.setPercentage(this.character.bottleCount * 20)
        });
        this.collectItems(this.level.coin, () => {
            this.character.coinCount = Math.min(5, this.character.coinCount + 1);
            this.statusBarCoin.setPercentage(this.character.coinCount * 20)
        });
        this.collectItems(this.level.heart, () => {
            this.character.energy = Math.min(100, this.character.energy + 20);
            this.statusBar.setPercentage(this.character.energy)
        });
    }

    /**
     * "collects" items so that deletes the items once the character hovers over them
     */
    collectItems(array, onCollect) {
        array.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                onCollect();
                array.splice(index, 1);
            }
        });
    }

    /**
     * Updates the flask bar when the user throws
     */
    checkThrowing() {
        if (!this.keyboard.SPACE || this.character.bottleCount <= 0) return;
        const bottle = new ThrowableObject(
            this.character.x,
            this.character.y + 100,
            this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.character.bottleCount--;
        this.statusBarFlask.setPercentage(this.character.bottleCount * 20);
    }

    /**
     * Inroduces the endGame to the world, also clears intervals to keep the game running smooth
     */
    endGame(type) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.audio.stopAll();
        if (type === "won") { this.audio.playMusic("gamewonmusic"); } else { this.audio.playMusic("gameovermusic"); }
        clearInterval(this.gameLoop);
        clearInterval(this.intervalRun);
        this.endScreen = new EndGame(
            type,
            this.character.coinCount,
            () => this.restartGame(),
            () => this.mainMenu());
        this.canvas.addEventListener("pointerdown", this.handleEndClick);
    }

    /**
     * @param {*} event reacts to what the user clicks 
     */
    handleEndClick = (event) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        const clicked = this.endScreen.getClickedButton(x, y);
        if (clicked === "playAgain") this.restartGame(), this.audio.playMusic("ingame");
        if (clicked === "mainMenu") this.mainMenu(), this.audio.playMusic("menu");
    }

    /**
     * "reloads" the game when the user clicks on the restart game by reloading the world instead of reloading the page 
     */
    restartGame() {
        this.canvas.removeEventListener("click", this.handleEndClick);
        world = new World(this.canvas, this.keyboard, this.audio);
    }

    /**
     * redirects the user back to main menu 
     */
    mainMenu() {
        this.canvas.removeEventListener("click", this.handleEndClick);
        showMenu = true;
        world = null;
        menu = new Menu(this.canvas, this.audio);
    }

    /**
     * @returns draws the whole world, needed multiple function as this one exceeds the limit of 15 lines of code per function
     */
    draw() {
        if (this.gameEnded) return this.drawEndScreen();
        this.clearCanvas();
        this.moveCamera();
        this.drawWorld();
        this.resetCamera();
    }

    /**
     * Draws the end screen with the image score count and two buttons
     */
    drawEndScreen() {
        this.clearCanvas();
        this.endScreen.draw(this.ctx);
    }

    /**
     * Function needed to clear the "old" movement pictures
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * needed for moving the camera as the character moves
     */
    moveCamera() {
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * "resets" the camera so that the stats bar stays "glued" to the screen instead of following the character
     */
    resetCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Needed for drawing the world and only the world objects 
     */
    drawWorld() {
        this.drawBackground();
        this.drawUI();
        this.drawGameObjects();
        this.phoneKeys.draw(this.ctx);
    }

    /**
     * Needed for drawing the background objects as the clouds, images etc...
     */
    drawBackground() {
        this.drawObjects(this.level.backgroundObjects);
        this.drawObjects(this.level.clouds);
    }

    /**
     * Draws the statusbars
     */
    drawUI() {
        this.resetCamera();
        [this.statusBar, this.statusBarCoin, this.statusBarFlask]
            .forEach(obj => this.addToMap(obj));
        this.moveCamera();
    }

    /**
     * Draws interactive characters as in coins,hearts, flasks etc...
     */
    drawGameObjects() {
        [this.character,
        this.level.groundBottles,
        this.level.coin,
        this.level.heart,
        this.level.enemies,
        this.level.enemiesSmall,
        this.throwableObjects
        ].forEach(obj => this.drawObjects(obj));
        this.drawBoss();
    }

    /**
     * Draws the endboss with his healthbar
     */
    drawBoss() {
        if (!this.level.endbossActive) return;
        this.addToMap(this.level.endboss);
        this.bossStatusBar.x = this.level.endboss.x;
        this.bossStatusBar.y = this.level.endboss.y - 40;
        const percent = (this.level.endboss.energy /
            this.level.endboss.maxEnergy) * 100;
        this.bossStatusBar.setPercentage(percent);
        this.addToMap(this.bossStatusBar);
    }

    /**
     * 
     * objects to the map
     */
    drawObjects(objects) {
        if (!Array.isArray(objects)) return this.addToMap(objects);
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Flips the image back when the character turns arround and applys it to the world
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips the image back when the character turns arround
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x *= -1;
    }

    /**
     * Restores the camera view back to normal when the character actually turns arround
     */
    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }
}