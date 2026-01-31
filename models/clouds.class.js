class Cloud extends MovableObject {
y = 40
height = 200
width = 300

constructor(){
    super().loadImage('img/5_background/layers/4_clouds/1.png', 'img/5_background/layers/4_clouds/2.png');
    this.x = Math.random() * 500;
    this.animate();
    }

    animate(){
        setInterval(()=>{
        this.x -= 0.25;
        },1000/60) // 60 fps;
    }
}