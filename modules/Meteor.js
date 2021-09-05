import Constants from "./Constants.js";
import {drawBoundingBox} from './Debug.js'

class Meteor {
  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    this._sprites = sprites;
    this._ctx = ctx;

    this._x = x;
    this._y = y;
    this._velocity = 2;
    this._dir = dir;

    this.VELOCITY = 2;

    this.SPRITE_SIZE = 48;
    this.SPRITE_SCALE = 2;

    this.BOUNDING_OFFSET = 0.4;

    this.ACCELERATION = 0.5;
  }

  update() {
    if (this._y < Constants.CANVAS_HEIGHT - this.SPRITE_SIZE * this.SPRITE_SCALE - 15) {
      this._velocity += this.ACCELERATION
      this._x += this._velocity * 0.5;
      this._y += this._velocity;
    }
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

  isDestroyed() {
    return this._x < - this.SPRITE_SIZE * this.SPRITE_SCALE;
  }

  getDirection() {
    return this._dir;
  }

  draw() {
    // the third parameter for y is calculting the bottom 
    // position relative to the start (top) of the canves
    // therefore we can use the y coordinate normally
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    this._ctx.drawImage(
      // Current sprite image
      this._sprites,
      // Sprite cutout/frame position in sprite
      32, 0, this.SPRITE_SIZE, this.SPRITE_SIZE,
      // Sprite x position on the canvas
      this._x,
      // Sprite y position on the canvas
      this._y,
      // Sprite size + scale
      this.SPRITE_SCALE * this.SPRITE_SIZE,
      this.SPRITE_SCALE * this.SPRITE_SIZE);
  }

  isCollision([subjectLeftX, subjectRightX, subjectTopY, subjectBottomY]) {
    const [meteorLeftX, meteorRightX, meteorTopY, meteorBottomY] = this.getBounding();

    if (
      meteorLeftX < subjectRightX && 
      meteorRightX > subjectLeftX && 
      meteorTopY < subjectBottomY &&
      meteorBottomY > subjectTopY) {
      return true;
    }

    return false;
  }

  getBounding() {
    const ratio = ((this.SPRITE_SCALE * this.SPRITE_SIZE) / 2) * (1 - this.BOUNDING_OFFSET);

    const leftX = this._x + ratio;
    const rightX = leftX + this.SPRITE_SCALE * this.SPRITE_SIZE - ratio;
    const topY = this._y + ratio;
    const bottomY = topY + this.SPRITE_SCALE * this.SPRITE_SIZE - ratio;

    return [leftX, rightX, topY, bottomY];
  }
}

export default Meteor;