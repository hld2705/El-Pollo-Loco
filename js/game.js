let canvas;
let world
let keyboard = new Keyboard();
let gameState = "loading";
let showMenu = true;
let menu = null;

/**
 * initializing function for the game
 */
function init() {
    canvas = document.getElementById("canvas");
    //world = new World(canvas, keyboard);
    loadGameAnimation()
    draw();
    canvas.addEventListener("mousemove", (e) => {
    if (menu && menu.isHovering) {
        canvas.style.cursor = menu.isHovering(e) ? "pointer" : "default";
    } else {
        canvas.style.cursor = "default";
    }
});
}

/**
 * function responsible for the "Game loading" animation
 */
async function loadGameAnimation() {
    let loadingscreen = document.getElementById("loadingscreen");
    loadingscreen.innerHTML = loadingTemplate();
    await new Promise(resolve => setTimeout(resolve, 4000));
    loadingscreen.innerHTML = "";
    gameState = "menu";
    menu = new Menu(canvas);
}

/**
 * here is where the canvas i.e. ctx. i.e main draw method is defined
 */
function draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showMenu) {
        if (menu) menu.draw(ctx);
    } else {
        world.draw();
    }

    requestAnimationFrame(draw);
}

/**
 * an eventlistener that sets the right keyboard key to "true" upon pressing, needed to register the character moving
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 68) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 65) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 87) {
        keyboard.UP = true;
    }
    if (e.keyCode == 83) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
});

/**
 * an eventlistener that sets the right keyboard key to "false" upon pressing, needed to register the character moving
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 68) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 65) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 87) {
        keyboard.UP = false;
    }
    if (e.keyCode == 83) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
});