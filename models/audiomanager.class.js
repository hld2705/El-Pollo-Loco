class AudioManager {
  constructor() {
    const savedMute = localStorage.getItem("gameMuted");
    this.muted = savedMute === "true";
    this.sounds = {
      ingame: new Audio("audio/ingamebackgroundmusic.mp3"),
      boss: new Audio("audio/ifenemybossappears.mp3"),
      gameovermusic: new Audio("audio/gameovermusic.mp3"),
      gamewonmusic: new Audio("audio/gamewon.ogg")
    };
    this.sounds.ingame.loop = true;
    this.currentMusic = "menu";
    //if (!this.muted) this.sounds[this.currentMusic].play().catch(() => { });
  }

  /**
     * Pauses all sounds ingame, to sync the sounds with each other
     */
  pauseAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
    });
  }

  /**
   * Resumes the current music, to keep the music state flowing
   */
  resumeCurrent() {
    if (!this.currentMusic) return;
    const sound = this.sounds[this.currentMusic];
    if (!sound) return;
    sound.play().catch(() => { });
  }
  /**
   * Stops all sounds ingame, to sync the sounds with each other
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Toggle mute on/off
   */
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("gameMuted", this.muted);
    if (this.muted) {
      this.pauseAll();
    } else {
      this.resumeCurrent();
    }
  }

  /**
   * Main function used to play sounds 
   */
  playMusic(track) {
    const newSound = this.sounds[track];
    if (!newSound) return;
    if (!this.currentMusic || this.currentMusic !== track) {
      if (this.currentMusic && this.sounds[this.currentMusic]) { this.sounds[this.currentMusic].pause(); }
      this.currentMusic = track;
      if (this.muted) return;
      this.sounds[track].currentTime = 0;
      this.sounds[track].volume = 0.1;
      this.sounds[track].play().catch(() => { });
    }
  }

  /**
   * Needed to play the smaller sounds for smaller animations
   */
  playSFX(name) {
    if (this.muted) return;
    let sound = this.sounds[name].cloneNode();
    sound.play().catch(() => { });
  }
}