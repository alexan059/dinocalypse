import Constants, { CHARACTER_STATE } from "./modules/Constants.js";
import imageLoader from "./modules/imageLoader.js";
import input from "./modules/Input.js";
import GameSubject from './modules/GameSubject.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// https://stackoverflow.com/questions/18547042/resizing-a-canvas-image-without-blurring-it
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// 1. Sprites
const assets = {
  jungle_tiles: './assets/jungle_spritemap.png',
  bg1: './assets/bg_layer_1.png',
  bg2: './assets/bg_layer_2.png',
  bg3: './assets/bg_layer_3.png',
  dino_R: './assets/dino_sprite_R.png',
  dino_L: './assets/dino_sprite_L.png',
  meteor: './assets/Asteroids.png'
}
let sprites;

// 2. Game Objects

let dino;

class Dino extends GameSubject {

  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    super(sprites, ctx, x, y, dir);
    this.SPRITE_SIZE = 24;
    this.SPRITE_SCALE = 3;

    this.JUMP_MAX_HEIGHT = 70;

    this.addAnimation(CHARACTER_STATE.IDLE, 0, 3);
    this.addAnimation(CHARACTER_STATE.MOVING, 3, 5);
    this.addAnimation(CHARACTER_STATE.JUMPING, 12, 0);
    this.addAnimation(CHARACTER_STATE.RUNNING, 17, 5);
  }

  isMoving() {
    return this._state === CHARACTER_STATE.MOVING;
  }
}

let meteor;
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
    console.log(this._x)
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
}

// 3. Environment

let jungle;

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
          CANVAS_HEIGHT - this._s(2, this.SPRITE_SCALE),
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


// 4. Game Loop

// DONE use dino sprite
// DONE make animated sprite
// DONE make animation states
// DONE add moving background
// TODO refactor movement/backgrounds
// TODO add obstacles
// TODO collision detection
// TODO add score
// TODO add start screen
// TODO add game over screen

(async () => {

  sprites = await imageLoader(assets);

  setupGame();

  runGame();

})();


function setupGame() {

  dino = new Dino({ left: sprites.dino_L, right: sprites.dino_R }, ctx, Constants.CANVAS_WIDTH / 2 - (24 * 3) / 2, 45);
  // snail = new Snail({ left: sprites.snail_L, right: sprites.snail_R }, ctx, 0, 45)
  jungle = new JungleBackground(sprites, ctx);

  meteor = new Meteor(sprites.meteor, ctx, Constants.CANVAS_WIDTH / 2, 0);
}

function runGame() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.height, canvas.width);

  // game calculation
  if (input.isPressed('right')) {
    // dino.move('right');
    jungle.move('left');
    meteor.move('left');
    dino.turn('right');
    dino.setState(CHARACTER_STATE.MOVING);
  } else if (input.isPressed('left')) {
    // dino.move('left');
    jungle.move('right');
    meteor.move('right');
    dino.turn('left');
    dino.setState(CHARACTER_STATE.MOVING);
  } else {
    // reset character state
    dino.setState(CHARACTER_STATE.IDLE);
  }

  if (input.isPressed('run') && dino.isMoving()) {
    // dino.move(dino.getDirection()); // twice as fast, because we are calling move twice before dino.draw()
    jungle.move(jungle.getDirection());
    meteor.move(meteor.getDirection());
    dino.setState(CHARACTER_STATE.RUNNING);
  }

  if (dino.isJumping()) { // already jumping
    dino.jump();
    dino.setState(CHARACTER_STATE.JUMPING);
  } else if (input.isPressed('jump')) { // jump starts here
    dino.jump();
  }

  // update events
  jungle.update();
  meteor.update();

  // drawing part  
  jungle.draw();
  dino.draw();
  meteor.draw();

  if (meteor.isDestroyed()) {
    meteor = new Meteor(sprites.meteor, ctx, Constants.CANVAS_WIDTH / 2, 0);
  }

  // next game frame (recursive)
  requestAnimationFrame(runGame);
}