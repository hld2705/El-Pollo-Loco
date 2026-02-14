# Bottle System Implementation Guide

## Overview
This guide explains how to implement a complete bottle system in El Pollo Loco with three distinct states:
1. **Ground Bottles** - Collectible bottles using `IMAGES_BOTTLE_GROUND`
2. **Rotating Bottles** - Mid-air rotation using `IMAGES_BOTTLE_ROTATING`
3. **Splash Animation** - Impact effect using `IMAGES_BOTTLE_SPLASH`

The system tracks bottle inventory in the status bar and handles collision detection.

---

## Step-by-Step Implementation Process

### STEP 1: Add Bottle Count to Character Class
**File:** `models/character.class.js`

**Location:** Add after the `speed = 10;` property (around line 3)

**Code to Add:**
```javascript
bottleCount = 0;
```

**Explanation:**
- `bottleCount` tracks how many bottles the character currently has collected
- Starts at 0
- Maximum should be 5 (represents 100% on the status bar)
- Each bottle = 20% on the status bar

**Why:** The character needs to store how many bottles they've collected so the game knows if they can throw one.

---

### STEP 2: Update ThrowableObject Class
**File:** `models/throwable-object.class.js`

**Location:** Replace the entire class with the following:

**Code:**
```javascript
class ThrowableObject extends MovableObject {

    IMAGES_BOTTLE_ROTATING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    IMAGES_BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    // NEW PROPERTIES - Track bottle state
    isSplashing = false;                    // Is the bottle currently showing splash animation?
    splashAnimationCounter = 0;             // How many times has splash animation played?
    hasCollided = false;                    // Has the bottle hit something?
    throwInterval;                          // Store interval reference for cleanup

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATING);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.loadImages(this.IMAGES_BOTTLE_GROUND);
        this.x = x;
        this.randomSpawn = Math.random() * 300;
        this.y = y;
        this.height = 100;
        this.width = 70;
        this.throw();
    }

    /**
     * Launches the bottle and sets up horizontal movement
     * Stores setInterval reference so we can stop it when bottle collides
     */
    throw() {
        this.speedY = 30;  // Initial upward velocity
        this.applyGravity();  // Apply gravity from MovableObject
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {  // Only move horizontally if not splashing
                this.x += 10;  // Move right by 10 pixels every 25ms
            }
        }, 25);
    }

    /**
     * Called every frame (60 fps) to update bottle animation
     * Different animation based on bottle state
     */
    update() {
        if (this.isSplashing) {
            // SPLASH STATE: Show splash animation
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            this.splashAnimationCounter++;
        } else if (!this.isAboveGround()) {
            // GROUND STATE: Show ground bottle animation
            this.playAnimation(this.IMAGES_BOTTLE_GROUND);
        } else {
            // IN-AIR STATE: Show rotating animation
            this.playAnimation(this.IMAGES_BOTTLE_ROTATING);
        }
    }

    /**
     * Called from World.checkBottleCollisions()
     * Triggers when bottle hits the ground (y position reaches 480 or lower)
     */
    checkCollisionWithGround() {
        // Only splash once per bottle
        if (!this.isAboveGround() && !this.isSplashing && !this.hasCollided) {
            this.hasCollided = true;      // Mark as collided
            this.isSplashing = true;      // Start splash animation
            this.speedY = 0;              // Stop falling
            clearInterval(this.throwInterval);  // Stop horizontal movement
        }
    }

    /**
     * Called from World.checkBottleCollisions() when bottle hits an enemy
     * Triggers the splash animation immediately
     */
    splashBottle() {
        // Only splash once per bottle
        if (!this.isSplashing && !this.hasCollided) {
            this.hasCollided = true;      // Mark as collided
            this.isSplashing = true;      // Start splash animation
            this.speedY = 0;              // Stop falling
            clearInterval(this.throwInterval);  // Stop horizontal movement
        }
    }

    /**
     * Checks if the splash animation has completed
     * Used by World to know when to remove the bottle from the game
     * @returns {boolean} true if splash animation is complete
     */
    isSplashComplete() {
        // Animation is complete when we've played more frames than the array length
        return this.isSplashing && this.splashAnimationCounter >= this.IMAGES_BOTTLE_SPLASH.length;
    }

    /**
     * Inherited from MovableObject, checks if bottle still above ground
     * @returns {boolean} true if y position is less than 480
     */
    isAboveGround() {
        return this.y < 480;
    }
}
```

**Key Points Explained:**

| Property | Purpose |
|----------|---------|
| `isSplashing` | Boolean flag. When true, shows splash animation instead of rotating/ground |
| `splashAnimationCounter` | Counts how many times splash animation has played to know when it's done |
| `hasCollided` | Prevents multiple collisions triggering splash more than once |
| `throwInterval` | Reference to the setInterval so we can stop it when bottle collides |

| Method | Purpose |
|--------|---------|
| `update()` | **Called 60 times/second**. Decides which animation to play based on bottle state |
| `checkCollisionWithGround()` | Triggered when bottle reaches ground level (y < 480) |
| `splashBottle()` | Triggered when bottle hits an enemy |
| `isSplashComplete()` | Returns true when splash animation has finished playing all 6 frames |

---

### STEP 3: Create Pickable Bottle Class
**File:** Create new file `models/pickable-bottle.class.js`

**Full Code:**
```javascript
class PickableBottle extends DrawableObject {

    IMAGES_BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    currentImageIndex = 0;  // Switch between image 0 and 1

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLE_GROUND);  // Pre-load both images
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 100;
        this.displayImage();      // Show first image
        this.startAnimation();    // Begin subtle pulsing animation
    }

    /**
     * Display current image based on currentImageIndex
     */
    displayImage() {
        let path = this.IMAGES_BOTTLE_GROUND[this.currentImageIndex];
        this.img = this.imageCache[path];
    }

    /**
     * Animate between the two bottle images to create pulsing effect
     * This helps player notice bottles on the ground
     */
    startAnimation() {
        setInterval(() => {
            // Alternate between 0 and 1
            this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_BOTTLE_GROUND.length;
            this.displayImage();
        }, 500);  // Change image every 500ms (smooth pulsing)
    }
}
```

**Explanation:**
- `PickableBottle` is a **separate class** from `ThrowableObject`
- It extends `DrawableObject` (not `MovableObject`) because it doesn't move
- It pulses between 2 images every 500ms to draw player's attention
- When character collides with it, it gets removed and `bottleCount` increases

---

### STEP 4: Update Level Class
**File:** `models/level.class.js`

**Modify the class to:**
```javascript
class Level {
    enemies;
    clouds;
    backgroundObjects;
    groundBottles;          // NEW: Array to store bottles on ground
    level_end_x = 1530;

    constructor(enemies, clouds, backgroundObjects, groundBottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.groundBottles = groundBottles;  // NEW: Accept groundBottles parameter
    }
}
```

**Explanation:**
- Added `groundBottles` property to store `PickableBottle` instances
- Default is empty array `[]`
- Passed as 4th parameter when creating Level instances

---

### STEP 5: Update Level 1
**File:** `levels/level1.js`

**Add 4th parameter with ground bottles:**
```javascript
const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud(),
        new Cloud(),
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
    ],
    [
        // NEW: Ground bottles spawned at random x positions
        new PickableBottle(300, 400),
        new PickableBottle(600, 400),
        new PickableBottle(900, 400),
        new PickableBottle(1200, 400),
        new PickableBottle(1500, 400)
    ]
);
```

**Explanation:**
- Added array of `PickableBottle` instances as 4th parameter
- Each bottle at y=400 (on ground level, just above ground collision at y=480)
- Spread at x positions: 300, 600, 900, 1200, 1500 across the level
- Player walks around and collects these

---

### STEP 6: Update World Class - Add Collection Method
**File:** `models/world.class.js`

**In the `run()` method, add new check:**
```javascript
run() {
    this.intervalRun = setInterval(() => {
        this.checkCollisions();
        this.checkBottleCollection();      // NEW LINE
        this.checkThrowableObjects();
        this.checkBottleCollisions();
    }, 200);
}
```

**Add new method after `checkCollisions()` method:**
```javascript
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
            // Bottle collected!
            this.character.bottleCount++;
            
            // Cap at 5 bottles max
            if (this.character.bottleCount > 5) {
                this.character.bottleCount = 5;
            }
            
            // Update status bar: each bottle = 20% (5 bottles = 100%)
            this.statusBarFlask.setPercentage(this.character.bottleCount * 20);
            
            // Remove bottle from world
            this.level.groundBottles.splice(index, 1);
        }
    });
}
```

**Explanation:**
- Loops through all ground bottles
- Checks if character overlaps with bottle
- If yes: increment `bottleCount`, cap at 5, update status bar (multiply by 20 for percentage), remove bottle

---

### STEP 7: Update World Class - Improve Throw Mechanics
**File:** `models/world.class.js`

**Replace existing `checkThrowableObjects()` method:**
```javascript
checkThrowableObjects() {
    // Only allow throwing if player has bottles AND presses SPACE
    if (this.keyboard.SPACE && this.character.bottleCount > 0) {
        // Create new bottle at character position
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100)
        this.throwableObjects.push(bottle);
        
        // Use up one bottle
        this.character.bottleCount--;
        
        // Update status bar immediately (each bottle = 20%)
        this.statusBarFlask.setPercentage(this.character.bottleCount * 20);
    }
}
```

**Explanation:**
- Check if SPACE pressed AND bottle count > 0
- Create bottle at character position (+offset)
- Decrease bottle count
- Update status bar to reflect new count

---

### STEP 8: Update World Class - Improve Update Method
**File:** `models/world.class.js`

**Replace existing `update()` method:**
```javascript
update() {
    this.character.update();
    
    this.level.enemies.forEach(enemy => {
        enemy.update();
    });
    
    // NEW: Call update on each bottle to handle animation
    this.throwableObjects.forEach(bottle => {
        bottle.applyGravity();
        bottle.update();        // NEW LINE - This triggers animation logic
    });
}
```

**Explanation:**
- Added `bottle.update()` call
- This is called 60 times per second
- Updates bottle animations each frame

---

### STEP 9: Update World Class - Improve Collision Detection
**File:** `models/world.class.js`

**Replace existing `checkBottleCollisions()` method:**
```javascript
checkBottleCollisions() {
    this.throwableObjects.forEach((bottle, index) => {
        // Check collision with enemies
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy)) {
                enemy.hit();                    // Damage enemy
                bottle.splashBottle();          // Start splash animation
            }
        });
        
        // Check collision with ground
        bottle.checkCollisionWithGround();
        
        // Remove bottle if splash animation is complete
        if (bottle.isSplashComplete()) {
            this.throwableObjects.splice(index, 1);  // Remove from array
        }
    });
}
```

**Explanation:**
- Check each bottle against all enemies
- If collision: damage enemy and trigger splash
- Check if bottle hit ground
- If splash animation done: remove bottle from world (cleanup)

---

### STEP 10: Update World Class - Draw Ground Bottles
**File:** `models/world.class.js`

**In `draw()` method, add this line before enemies:**
```javascript
draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectstoMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarFlask);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectstoMap(this.level.clouds);
    this.addObjectstoMap(this.level.groundBottles);     // NEW LINE
    this.addObjectstoMap(this.level.enemies);
    this.addObjectstoMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
}
```

**Explanation:**
- Draw ground bottles before enemies so bottles appear behind enemies visually
- Makes the game look more layered and realistic

---

## How It All Works Together - Flow Diagram

```
GAME FLOW:

1. BOOT/INITIALIZATION
   ├─ World creates Character (bottleCount = 0)
   ├─ World loads level1
   └─ level1 contains 5 PickableBottles on ground

2. GAME LOOP (Every Frame - 60 fps)
   ├─ update() called
   │  ├─ character.update()
   │  ├─ enemies.update()
   │  └─ bottles.update() (animation logic)
   └─ draw() called
      └─ Renders everything including groundBottles

3. EVERY 200ms - Collision Checks
   ├─ checkCollisions()
   │  └─ Character ↔ Enemies
   │
   ├─ checkBottleCollection()
   │  ├─ Character ↔ Ground Bottles
   │  ├─ If collision: bottleCount++, remove bottle
   │  └─ UPDATE STATUSBAR
   │
   ├─ checkThrowableObjects()
   │  ├─ If SPACE && bottleCount > 0:
   │  ├─ Create new ThrowableObject
   │  ├─ bottleCount--
   │  └─ UPDATE STATUSBAR
   │
   └─ checkBottleCollisions()
      ├─ Thrown Bottle ↔ Enemies
      │  └─ If collision: splashBottle()
      ├─ Thrown Bottle ↔ Ground
      │  └─ If collision: checkCollisionWithGround()
      └─ If splash done: remove bottle

4. BOTTLE STATES (In ThrowableObject.update())
   ├─ IN-AIR
   │  ├─ isAboveGround() = true
   │  ├─ isSplashing = false
   │  └─ Play IMAGES_BOTTLE_ROTATING
   │
   ├─ ON-GROUND (Not splashing)
   │  ├─ isAboveGround() = false
   │  ├─ isSplashing = false
   │  └─ Play IMAGES_BOTTLE_GROUND
   │
   └─ SPLASHING
      ├─ isSplashing = true
      ├─ Play IMAGES_BOTTLE_SPLASH
      ├─ Animation counter increments
      └─ When done: remove from world
```

---

## StatusBar Integration - Percentage Calculation

The `StatusBarFlask` uses a `percentage` value from 0-100:

```
Bottle Count → Percentage
    0      →      0%      (0 * 20)
    1      →     20%      (1 * 20)
    2      →     40%      (2 * 20)
    3      →     60%      (3 * 20)
    4      →     80%      (4 * 20)
    5      →    100%      (5 * 20)
```

**Key Locations to Update Status Bar:**
1. When bottle collected: `this.statusBarFlask.setPercentage(this.character.bottleCount * 20);`
2. When bottle thrown: `this.statusBarFlask.setPercentage(this.character.bottleCount * 20);`

---

## Image Arrays - What Each Does

### IMAGES_BOTTLE_GROUND (2 images)
```javascript
IMAGES_BOTTLE_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
]
```
- Used by `PickableBottle` class
- Alternates every 500ms to pulse/draw attention
- Shows bottle sitting on the ground waiting to be collected

### IMAGES_BOTTLE_ROTATING (4 images)
```javascript
IMAGES_BOTTLE_ROTATING = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
]
```
- Used by `ThrowableObject` when in air
- Plays continuously (4-frame rotation cycle)
- Shows bottle spinning as it flies through the air
- Loops until collision detected

### IMAGES_BOTTLE_SPLASH (6 images)
```javascript
IMAGES_BOTTLE_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
]
```
- Used by `ThrowableObject` when `isSplashing = true`
- Plays once on collision (6-frame splash effect)
- After 6 frames: bottle is removed from game

---

## Key Concepts Explained

### Why Store throwInterval Reference?
```javascript
this.throwInterval = setInterval(() => { ... }, 25);
```
When bottle collides, we need to STOP horizontal movement:
```javascript
clearInterval(this.throwInterval);
```
Without storing the reference, we can't clear it later.

### Why Use splashAnimationCounter?
The `playAnimation()` method auto-increments `currentImage++` each call.
We need to know "how many times did playAnimation run?" to detect when animation completes:
```javascript
isSplashComplete() {
    return this.isSplashing && this.splashAnimationCounter >= this.IMAGES_BOTTLE_SPLASH.length;
}
// Returns true after playing all 6 splash frames
```

### Why Check hasCollided Flag?
Prevents multiple collisions triggering splash multiple times:
```javascript
if (!this.isSplashing && !this.hasCollided) {
    // This code only runs ONCE per bottle
}
```

### Why Cap Bottle Count at 5?
```javascript
if (this.character.bottleCount > 5) {
    this.character.bottleCount = 5;
}
```
Status bar only goes to 100%, which = 5 bottles × 20%.
Prevents accumulating bottles beyond what status bar can show.

---

## Testing Checklist

After implementing all steps, verify:

- [ ] Ground bottles appear on screen and pulse
- [ ] Character can walk over bottles and collect them
- [ ] Status bar updates when collecting (0% → 20% → 40% → etc)
- [ ] Can only throw if bottleCount > 0
- [ ] Status bar decreases when throwing (100% → 80% → etc)
- [ ] Thrown bottle rotates in air
- [ ] Thrown bottle shows splash when hitting enemy
- [ ] Thrown bottle shows splash when hitting ground
- [ ] Bottle disappears after splash animation completes
- [ ] Status bar caps at 100% (5 bottles max)
- [ ] Multiple bottles on screen work simultaneously

---

## Summary Checklist

When implementing, update these files in this order:

1. ✅ `character.class.js` - Add `bottleCount = 0;`
2. ✅ `throwable-object.class.js` - Complete rewrite with animation states
3. ✅ `pickable-bottle.class.js` - Create new file
4. ✅ `level.class.js` - Add `groundBottles` parameter
5. ✅ `level1.js` - Add ground bottles to level
6. ✅ `world.class.js` - 5 changes:
   - Update `update()` method
   - Update `checkThrowableObjects()` method
   - Add `checkBottleCollection()` method
   - Update `checkBottleCollisions()` method
   - Update `draw()` method

Total: 6 files to modify/create
