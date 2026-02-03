class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];

    clouds = [
        new Cloud(),
        new Cloud(),
    ]

    backgroundObjects = [
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0)
    ]

    ctx;

    canvas; // ova canvas varijabla je potrebna pri clear animation frame, potrebna je tako sto se kod svakog frame-a istovremeno
    // ekran mora ocistiti i opet crtati

    keyboard;
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // sa ovim se onda uvodi u pricu nova varijabla imena canvas
        this.keyboard = keyboard
        this.draw();
        this.setWorld();

    }

    setWorld(){
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.addObjectstoMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectstoMap(this.clouds);
        this.addObjectstoMap(this.enemies);

        // Draw() se uvijek izvrsava
        let self = this; // ovo je potrebno zato sto u requestAnimationFrame .this vise nije prepoznat
        requestAnimationFrame(function(){
            self.draw();
        });
    };

    addObjectstoMap(objects){
        objects.forEach(o => {
            this.addToMap(o)
        })
    }

    addToMap(mo){
        if(mo.otherDirection){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1,1);
            mo.x = mo.x * - 1; // potrebno jer ctx.translate ne funkcionise bas kako se pise, tako da se sirina objekta mora manipuilisati
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if(mo.otherDirection){
            mo.x = mo.x * - 1;
            this.ctx.restore();
        }
    }

}