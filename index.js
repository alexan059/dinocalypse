import imageLoader from "./modules/imageLoader.js";
import input from "./modules/Input.js";

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
  snail_R: './assets/snail_R.png',
  snail_L: './assets/snail_L.png',
  jungle_tiles: './assets/jungle_spritemap.png',
  bg1: './assets/bg_layer_1.png',
  bg2: './assets/bg_layer_2.png',
  bg3: './assets/bg_layer_3.png'
}
let sprites;

// 2. Game Objects

let snail;

class Snail {
  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    this._sprites = sprites;

    this._ctx = ctx; // context of canvas

    this._dir = dir;
    this._x = x;
    this._y = y;

    this.VELOCITY = 2;
    this.JUMP_SLOWITY = 30;
    this.JUMP_MAX_HEIGHT = 50;
    this.SPRITE_SIZE = 64;

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
    this._ctx.drawImage(this._getSnailImage(), this._x, CANVAS_HEIGHT - this.SPRITE_SIZE - this._y - this._jumpY);
  }

  _getSnailImage() {
    return this._dir === 'right' ? this._sprites.snail_R : this._sprites.snail_L;
  }
}

// 3. Environment

let jungle;

class JungleBackground {

  constructor(sprites, ctx) {
    this._sprites = sprites;
    this._ctx = ctx;

    this.SPRITE_SIZE = 16;
  }

  _s(size, scale = 1) {
    return this.SPRITE_SIZE * size * scale;
  }

  _drawSoil() {
    this._ctx.drawImage(this._sprites.jungle_tiles, this._s(1), this._s(14), this._s(10), this._s(2), 0, CANVAS_HEIGHT - this._s(2, 2), this._s(10, 2), this._s(2, 2));
    this._ctx.drawImage(this._sprites.jungle_tiles, this._s(1), this._s(14), this._s(10), this._s(2), this._s(10, 2), CANVAS_HEIGHT - this._s(2, 2), this._s(10, 2), this._s(2, 2));
  }

  _drawBackground() {
    this._ctx.drawImage(this._sprites.bg1, 0, 0, 384 * 2.5, 216 * 2.5);
    this._ctx.drawImage(this._sprites.bg2, 0, 0, 384 * 2.5, 216 * 2.5);
    this._ctx.drawImage(this._sprites.bg3, 0, 0, 384 * 2.5, 216 * 2.5);
  }

  draw() {
    this._drawBackground();
    this._drawSoil();
  }

}


// 4. Game Loop

// TODO refactor snail
// TODO make y friendly for calculation
// TODO add moving background and obstacles
// TODO collision detection

(async () => {

  sprites = await imageLoader(assets);

  console.log(sprites);

  setupGame();

  runGame();

})();


function setupGame() {

  snail = new Snail(sprites, ctx, 0, 45);
  jungle = new JungleBackground(sprites, ctx);

}

function runGame() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.height, canvas.width);

  // game calculation
  if (input.isPressed('right')) {
    snail.move('right');
  } else if (input.isPressed('left')) {
    snail.move('left');
  }

  if (snail.isJumping()) {
    snail.jump();
  } else if (input.isPressed('jump')) {
    snail.jump();
  }

  // drawing part  
  jungle.draw();
  snail.draw();

  // next game frame
  requestAnimationFrame(runGame);
}




// Game Storyboard

/**
 * A lonely Dino in a jungle is running away from metor ball.
 * He has to run & jump obstacles or he will be slown down and the
 * meteor ball will catch and kill him.
 * 
 * The dino can find items on the way to make him faster
 * for a short period of time.
 */

// Lecture Structure

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */