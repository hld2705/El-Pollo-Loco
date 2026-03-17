function createLevel1() {
    return new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken()
        ],
        [
            new Cloud(),
            new Cloud()
        ],
        (function () {
            let arr = [];
            let width = 719;
            let leftSegments = 2;
            let rightSegments = 20;

            for (let i = -leftSegments; i < rightSegments; i++) {
                let x = width * i;
                let imgNumber = (Math.abs(i) % 2) + 1;

                arr.push(new BackgroundObject('img/5_background/layers/air.png', x));
                arr.push(new BackgroundObject('img/5_background/layers/3_third_layer/' + imgNumber + '.png', x));
                arr.push(new BackgroundObject('img/5_background/layers/2_second_layer/' + imgNumber + '.png', x));
                arr.push(new BackgroundObject('img/5_background/layers/1_first_layer/' + imgNumber + '.png', x));
            }

            return arr;
        })(),
        [
            new PickableBottle(300, 350),
            new PickableBottle(400, 350),
            new PickableBottle(500, 350),
            new PickableBottle(600, 350),
            new PickableBottle(850, 350),
            new PickableBottle(200, 350),
            new PickableBottle(700, 350),
            new PickableBottle(680, 350),
            new PickableBottle(584, 350),
            new PickableBottle(985, 350)
        ],
        [
            new Coin(300, 200),
            new Coin(700, 110),
            new Coin(500, 310),
            new Coin(1100, 200),
            new Coin(1400, 200)
        ],
        [
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken()
        ],
        [
            new Heart(350, 300),
            new Heart(200, 110),
            new Heart(400, 310),
            new Heart(900, 200),
            new Heart(1000, 200)
        ],
        new Endboss()
    );
}