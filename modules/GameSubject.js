import Constants from './Constants.js'

class GameSubject {
  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    this._sprites = sprites;

    this._ctx = ctx; // context of canvas

    this._dir = dir;
    this._x = x;
    this._y = y;

    this._frameCounter = 0

    this.VELOCITY = 2;
    this.JUMP_SLOWITY = 30;
    this.JUMP_MAX_HEIGHT = 50;
    this.SPRITE_SIZE = 64;
    this.SPRITE_SCALE = 1;

    this._jumping = false;
    this._jumpY = 0;
    this._jumpProgress = 0;
    this._JumpVelocity = Math.PI / this.JUMP_SLOWITY;
  }

  move(dir) {
    if (dir === 'right') {
      this._dir = 'right';
      this._x += this.VELOCITY;
    } else {
      this._dir = 'left';
      this._x -= this.VELOCITY;
    }
  }

  isJumping() {
    return this._jumping;
  }

  jump() {
    if (this.isJumping()) { // is already jumping then calculate
      this._jumpY = Math.abs(Math.sin(this._jumpProgress)) * this.JUMP_MAX_HEIGHT;
      this._jumpProgress += this._JumpVelocity;

      if (this._jumpProgress >= Math.PI) { // jumping is done
        this._jumpY = 0;
        this._jumpProgress = 0;
        this._jumping = false;
      }
    } else { // when we first jump
      this._jumping = true;
    }
  }

  draw() {
    // the third parameter for y is calculting the bottom 
    // position relative to the start (top) of the canves
    // therefore we can use the y coordinate normally
    this._ctx.drawImage(
      // Current sprite image
      this._getSprite(), 
      // Sprite cutout position
      this._getCurrentFrame(), 0, this.SPRITE_SIZE, this.SPRITE_SIZE,
      // Sprite x position on the canvas
      this._x, 
      // Sprite y position on the canvas + jumping offset
      Constants.CANVAS_HEIGHT - this.SPRITE_SCALE * this.SPRITE_SIZE - this._y - this._jumpY, 
      // Sprite size + scale
      this.SPRITE_SCALE * this.SPRITE_SIZE, 
      this.SPRITE_SCALE * this.SPRITE_SIZE);
  }

  _getSprite() {
    return this._dir === 'right' ? this._sprites.right : this._sprites.left;
  }

  _getCurrentFrame() {
    if (this._frameCounter > 24) {
      this._frameCounter = 0;
    } else {
      this._frameCounter++;
    }
  

    return Math.floor(this._frameCounter / 8) * this.SPRITE_SIZE;
  }
}

export default GameSubject;