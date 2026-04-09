let canvas;
let world
let keyboard = new Keyboard();
let gameState = "loading";
let showMenu = true;
let menu = null;
let audio = new AudioManager();
let phone;


/**
 * initializing function for the game
 */
function init() {
    canvas = document.getElementById("canvas");
    menu = new Menu(canvas, audio);
    draw();
    canvas.addEventListener("mousemove", (e) => {
        if (menu && menu.isHovering) {
            canvas.style.cursor = menu.isHovering(e) ? "pointer" : "default";
        } else { canvas.style.cursor = "default"; }
    });
   
}

/**
 * Toggle function for the h1 inside HTML to keep the responsivnes of the page
 */
function handleResize() {
    let h1 = document.getElementById("h1overview");

    if (isMobileDevice()) {
        if (isPortraitMobile()) {
            h1.style.display = "block";
        } else {
            h1.style.display = "none";
        }
    } else {
        h1.style.display = "block";
        h1.style.textAlign = "center";
    }
}

/**
 * Event listener on resize for the screen to automatially update depending on the size of the screen
 */
window.addEventListener("resize", handleResize);
handleResize();
 
/**
  * Draws a message, informing the user that he should rotate his phone, in order to play fullscreen
  */
function drawRotateMessage(ctx, canvas) {
    const centerY = canvas.height / 2;
    const spacing = 60;
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "60px Sancreek";
    ctx.fillText("Rotate your phone", canvas.width / 2, centerY - spacing);
    ctx.font = "40px Sancreek";
    ctx.fillText("Please play in landscape mode", canvas.width / 2, centerY + spacing);
}

/**
 * @returns The parrameter if the users phone is tilted, i.e. if the window.innerWidth is lower than 900px
 */
function isPortraitMobile() {
    return window.innerWidth < 900 && window.innerHeight > window.innerWidth;
}

/**
 * Helper function for recognizing the user is actually on his phone
 */
function isMobileDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * here is where the canvas i.e. ctx. i.e main draw method is defined
 */
function draw() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isPortraitMobile()) {
        drawRotateMessage(ctx, canvas);
        requestAnimationFrame(draw);
        return;
    }
    if (showMenu) {
        if (menu) menu.draw(ctx);
    } else if (world) {
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