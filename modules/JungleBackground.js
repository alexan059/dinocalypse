import Constants from "./Constants.js";

class JungleBackground {

  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    this._sprites = sprites;
    this._ctx = ctx;

    this._dir = dir;
    this._x = x;
    this._y = y;

    this._bg2Width = 384 * 2.5;
    this._bg2Height = 216 * 2.5;
    this._bg2X = 0;

    this._bg3Width = 384 * 2.5;
    this._bg3Height = 216 * 2.5;
    this._bg3X = 0;

    this.VELOCITY = 2;
    this.SPRITE_SIZE = 16;
    this.SPRITE_SCALE = 2;

    this._soilLength = Constants.CANVAS_WIDTH / (this.SPRITE_SIZE * this.SPRITE_SCALE); // 640 / (16 * 2) = 20
    this._soilMap = [
      // 20 pieces fits inside screen beacuse 640 width divided by 32 (16 * 2 scale) = 20
      // viewable part
      [6, 2], [6, 2], [6, 2], [6, 2], [6, 2],
      [6, 2], [1, 14], [2, 14], [3, 14], [3, 14],
      [4, 14], [5, 14], [6, 14], [7, 14], [8, 14],
      [6, 2], [6, 2], [9, 14], [6, 2], [6, 2],
      // outside view
      [6, 2], [6, 2], [2, 14], [6, 2], [6, 2],
      [6, 2], [6, 2], [3, 14], [4, 14], [5, 14],
      [6, 14], [7, 14], [7, 14], [8, 14], [6, 2],
      [6, 2], [2, 14], [3, 14], [2, 14], [3, 14]
    ];
  }

  move(dir) {
    if (dir === 'right') {
      this._dir = 'right';
      this._x += this.VELOCITY;
      this._bg2X += this.VELOCITY * 0.5;
      this._bg3X += this.VELOCITY * 0.75;
    } else {
      this._dir = 'left';
      this._x -= this.VELOCITY;
      this._bg2X -= this.VELOCITY * 0.5;
      this._bg3X -= this.VELOCITY * 0.75;
    }
  }

  getDirection() {
    return this._dir;
  }

  update() {
    // check if soil is inside camera/canvas
    if (this._x <= -this.SPRITE_SIZE * this.SPRITE_SCALE) {
      const tempSoil = this._soilMap.shift();
      this._soilMap.push(tempSoil);
      this._x = 0;
    } else if (this._x >= this.SPRITE_SIZE * this.SPRITE_SCALE) {
      const tempSoil = this._soilMap.pop();
      this._soilMap.unshift(tempSoil);
      this._x = 0;
    }

    if (this._bg3X <= -this._bg3Width) {
      this._bg3X = 0;
    } else if (this._bg3X > 0) {
      this._bg3X = -this._bg3Width;
    }

    if (this._bg2X <= -this._bg2Width) {
      this._bg2X = 0;
    } else if (this._bg2X > 0) {
      this._bg2X = -this._bg2Width;
    }
  }

  _s(size, scale = 1) {
    return this.SPRITE_SIZE * size * scale;

  }



  _drawSoil() {
    this._soilMap.forEach(([x, y], index) => {
      if (index < this._soilLength + 2) {
        this._ctx.drawImage(
          // tiles sprite image
          this._sprites.jungle_tiles,
          // sX, sY, sWidth, sHeight
          this._s(x), this._s(y), this._s(1), this._s(2),
          // dX, dY, dWidth, dHeight
          this._x + this.SPRITE_SIZE * (index -1) * this.SPRITE_SCALE,
          Constants.CANVAS_HEIGHT - this._s(2, this.SPRITE_SCALE),
          this._s(1, this.SPRITE_SCALE),
          this._s(2, this.SPRITE_SCALE)
        );
      }
    });
  }

  _drawBackground() {
    // background sky
    this._ctx.drawImage(this._sprites.bg1, 0, 0, 384 * 2.5, 216 * 2.5);
    // background far
    this._ctx.drawImage(this._sprites.bg2, this._bg2X, 0, this._bg2Width, this._bg2Height);
    this._ctx.drawImage(this._sprites.bg2, this._bg2X + this._bg2Width, 0, this._bg2Width, this._bg2Height);
    // background close
    this._ctx.drawImage(this._sprites.bg3, this._bg3X, 0, this._bg3Width, this._bg3Height);
    this._ctx.drawImage(this._sprites.bg3, this._bg3X + this._bg3Width, 0, this._bg3Width, this._bg3Height);
  }

  draw() {
    this._drawBackground();
    this._drawSoil();
  }

}

export default JungleBackground;