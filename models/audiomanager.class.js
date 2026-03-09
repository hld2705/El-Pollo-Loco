class AudioManager {
  constructor() {
    this.muted = false;
    this.currentMusic = null;

    this.sounds = {
      jump: new Audio("audio/crunchy_jump.mp3"),
      walk: new Audio("audio/crunchy_walk.wav"),
      menu: new Audio("audio/mainmenumusic.mp3"),
      ingame: new Audio("audio/ingamebackgroundmusic.mp3"),
      boss: new Audio("audio/ifenemybossappears.mp3"),
      gameovermusic: new Audio("audio/gameovermusic.mp3"),
      gamewonmusic: new Audio("audio/gamewon.ogg")
    };

    this.sounds.menu.loop = true;
    this.sounds.ingame.loop = true;
  }

  /**
   * Stops all sounds ingame, to sync the sounds with each other
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.currentMusic = null;
  }

  /**
   * Toggle mute on/off
   */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAll();
    } else if (this.currentMusic) {
      // resume whichever music was most recently playing
      this.playMusic(this.currentMusic);
    }
  }

  /**
   * Main function used to play sounds 
   */
  playMusic(track) {
    if (this.muted) return;
    if (!this.currentMusic || this.currentMusic !== track) {
      if (this.currentMusic) this.sounds[this.currentMusic].pause();
      this.currentMusic = track;
      this.sounds[track].currentTime = 0;
      this.sounds[track].play().catch(() => {});
      this.sounds[track].volume = 0.1;
    }
  }

  /**
   * Needed to play the smaller sounds for smaller animations
   */
  playSFX(name) {
    if (this.muted) return;
    let sound = this.sounds[name].cloneNode();
    sound.play().catch(() => {});
  }
}