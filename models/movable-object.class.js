class MovableObject {
    x = 120;
    y = 255;
    img;
    height = 150;
    width = 100;
    imageCache=[];
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

applyGravity() {
    setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } 
    }, 1000 / 25);
}

    isAboveGround(){
        return this.y < 180;
    }

//loadImage('img/test.png')
    loadImage(path){
        this.img = new Image(); // this.img = document.getElementById('image') ili isto sto i <img id="image" src="...">
        this.img.src = path;
    }

    /**
     * 
     * @param {Array} arr  ['img/image1.png', 'img/image2.png', ...]
     */
    loadImages(arr){
        arr.forEach(path => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
         });
    }

    draw(ctx){
       ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken){ // instanceof se odnosi SAMO I SAMO na Character i Chicken u ovom slucaju
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }
    moveRight(){
        this.x += this.speed;
    }

    moveLeft(){
        this.x -= this.speed;
        
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump(){
        this.speedY = 25;
    }

    hit(){
        this.energy -= 5;
        if(this.energy < 0){
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    isDead(){
        return this.energy == 0;
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    isColliding(mo){
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height
    }
}