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

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // sa ovim se onda uvodi u pricu nova varijabla imena canvas
        this.draw();
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
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }

}