const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ],

    [
        new Cloud(),
        new Cloud()
    ],
    (function() {
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
        new PickableBottle(300, 400),
        new PickableBottle(600, 400),
        new PickableBottle(900, 400),
        new PickableBottle(1200, 400),
        new PickableBottle(1500, 400)
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
    new Endboss()
);