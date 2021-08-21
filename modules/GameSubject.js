import Constants, { CHARACTER_STATE } from './Constants.js'

class SubjectAnimation {
  constructor(id, startFrame, frameCount, spriteSize, frameThrottle = 8) {
    this._id = id;

    this._startFrame = startFrame; // first image position of sprite
    this._frameCount = frameCount; // how many images counting from start
    this._spriteSize = spriteSize;

    this._frameCounter = 0;

    this._frameThrottle = frameThrottle; // slowness factor for calculating frame of 60fps

    this._lastFrame = this._frameCount * this._frameThrottle; // calculate last frame for the counter
  }

  getFrame() {
    if (this._frameCounter > this._lastFrame) { // 3 frames * 8 times slower = 24
      this._frameCounter = 0;
    } else {
      this._frameCounter++;
    }

    // 8 times slower than 60 fps
    // it will return a number from startFrame to lastFrame which could be 0-3 or 3-8
    // the start frame is the offset in the sprite
    return (Math.floor(this._frameCounter / this._frameThrottle) + this._startFrame) * this._spriteSize; // 8 times slower ex. 3 * 24 (sprite size)
  }
}

class GameSubject {
  constructor(sprites, ctx, x = 0, y = 0, dir = 'right', state = CHARACTER_STATE.IDLE) {
    this._sprites = sprites;

    this._ctx = ctx; // context of canvas

    this._animationStates = {}; // we add states on our child class
    this._state = state; // current state

    this._dir = dir;
    this._x = x;
    this._y = y;

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

  addAnimation(state, startFrame, frameCount, frameThrottle = 8) {
    this._animationStates[state] = new SubjectAnimation(state, startFrame, frameCount, this.SPRITE_SIZE, frameThrottle);
  }

  setState(state) {
    this._state = state;
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

  getDirection() {
    return this._dir;
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
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    this._ctx.drawImage(
      // Current sprite image
      this._getSprite(),
      // Sprite cutout/frame position in sprite
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
    return this._animationStates[this._state].getFrame();
  }
}

export default GameSubject;