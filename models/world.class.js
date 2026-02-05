class World {
    character = new Character();
    level = level1;
    ctx;
    canvas; // ova canvas varijabla je potrebna pri clear animation frame, potrebna je tako sto se kod svakog frame-a istovremeno
    // ekran mora ocistiti i opet crtati
    keyboard;
    camera_x = 0; // varijabla za pomicanje svijeta

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // sa ovim se onda uvodi u pricu nova varijabla imena canvas
        this.keyboard = keyboard
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectstoMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectstoMap(this.level.clouds);
        this.addObjectstoMap(this.level.enemies);
        this.ctx.translate(-this.camera_x, 0);
        // Draw() se uvijek izvrsava
        let self = this; // ovo je potrebno zato sto u requestAnimationFrame .this vise nije prepoznat
        requestAnimationFrame(function () {
            self.draw();
        });
    };

    addObjectstoMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        })
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * - 1; // potrebno jer ctx.translate ne funkcionise bas kako se pise, tako da se sirina objekta mora manipuilisati
        }
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            mo.x = mo.x * - 1;
            this.ctx.restore();
        }
    }

}