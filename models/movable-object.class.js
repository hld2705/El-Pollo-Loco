class MovableObject {
    x = 120;
    y = 255;
    img;
    height = 150;
    width = 100;

//loadImage('img/test.png')
    loadImage(path){
        this.img = new Image(); // this.img = document.getElementById('image') ili isto sto i <img id="image" src="...">
        this.img.src = path;
    }

    moveRight(){
        console.log('Moving rigt');
    }

    moveLeft(){
        
    }
}