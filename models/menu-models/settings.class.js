class Settings extends Menu {
    constructor(canvas) {
        super(canvas);
        this.musicVolume = 0.5;
        this.soundVolume = 0.5;
    }

    /**
     * 
     * @param {canvas} ctx draws the settings menu with the custom sfx sliders
     */
    draw(ctx) {
        // background box
        ctx.fillStyle = "#E59757";
        ctx.fillRect(this.x - 200, this.y - 150, 400, 300);
        ctx.fillStyle = "white";
        ctx.font = "20px Sancreek";
        ctx.textAlign = "left";
        ctx.fillText("Music Volume", this.x - 150, this.y - 80);
        ctx.fillText("Sound Volume", this.x - 150, this.y - 20);
        ctx.fillText("Fullscreen", this.x - 150, this.y + 40);
        // Music slider line
        ctx.fillRect(this.x - 150, this.y - 60, 200, 5);
        ctx.fillRect(
            this.x - 150 + this.musicVolume * 200 - 5,
            this.y - 65, 10, 15);
        // Sound slider line
        ctx.fillRect(this.x - 150, this.y, 200, 5);
        ctx.fillRect(
            this.x - 150 + this.soundVolume * 200 - 5,
            this.y - 5, 10, 15);
        // Back button
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("BACK", this.x, this.y + 110);
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // MUSIC SLIDER
        if (mouseX > this.x - 150 && mouseX < this.x + 50 && mouseY > this.y - 70 && mouseY < this.y - 40
        ) {
            this.musicVolume = (mouseX - (this.x - 150)) / 200; this.musicVolume = Math.max(0, Math.min(1, this.musicVolume));
            this.updateMusicVolume();
        }
        // SOUND SLIDER
        if (mouseX > this.x - 150 && mouseX < this.x + 50 && mouseY > this.y - 10 && mouseY < this.y + 20
        ) {
            this.soundVolume = (mouseX - (this.x - 150)) / 200; this.soundVolume = Math.max(0, Math.min(1, this.soundVolume));
            this.updateSoundVolume();
        }
        // FULLSCREEN
        if (mouseX > this.x - 150 && mouseX < this.x + 150 && mouseY > this.y + 25 && mouseY < this.y + 55) {
            this.toggleFullscreen();
        }
        // BACK
        if (mouseY > this.y + 90 && mouseY < this.y + 120) {
            menu = new Menu(this.canvas);
        }
    }

    /**
     * Updates the music sound accordingly to the user preferences
     */
    updateMusicVolume() {
        if (window.gameMusic) {
            window.gameMusic.volume = this.musicVolume;
        }
    }

    /**
     * Updates the character sound accordingly to the user preferences
     */
    updateSoundVolume() {
        // Example: update character sounds
        if (world && world.character) {
            world.character.audioWalk.volume = this.soundVolume;
            world.character.audioJump.volume = this.soundVolume;
        }
    }

    /**
     * returns if fullscreen option is pressed or not
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {document.exitFullscreen();}
    }

    /**
   * 
   * @param {event} e notices that the user is hovering over an object
   * @returns curor = "pointer"
   */
    isHovering(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (mouseY > this.y + 90 && mouseY < this.y + 120) {
            return true;
        }
        if (mouseX > this.x - 150 && mouseX < this.x + 50 && mouseY > this.y - 70 && mouseY < this.y - 40) {
            return true;
        } return false;
    }

}