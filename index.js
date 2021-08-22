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
  snail_R: './assets/snail_R.png',
  snail_L: './assets/snail_L.png',
  jungle_tiles: './assets/jungle_spritemap.png',
  bg1: './assets/bg_layer_1.png',
  bg2: './assets/bg_layer_2.png',
  bg3: './assets/bg_layer_3.png',
  dino_R: './assets/dino_sprite_R.png',
  dino_L: './assets/dino_sprite_L.png'
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

class Snail extends GameSubject {

  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    super(sprites, ctx, x, y, dir);
    this.SPRITE_SIZE = 64;
    this.SPRITE_SCALE = 1;
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
    } else {
      this._dir = 'left';
      this._x -= this.VELOCITY;
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
    this._ctx.drawImage(this._sprites.bg1, 0, 0, 384 * 2.5, 216 * 2.5);
    // this._ctx.drawImage(this._sprites.bg2, 0, 0, 384 * 2.5, 216 * 2.5);
    // this._ctx.drawImage(this._sprites.bg3, 0, 0, 384 * 2.5, 216 * 2.5);
  }

  draw() {
    this._drawBackground();
    this._drawSoil();
  }

}


// 4. Game Loop

// DONE TODO use dino sprite
// DONE TODO make animated sprite
// DONE TODO make animation states
// TODO add moving background
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

}

function runGame() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.height, canvas.width);

  // game calculation
  if (input.isPressed('right')) {
    // dino.move('right');
    jungle.move('left');
    dino.turn('right');
    dino.setState(CHARACTER_STATE.MOVING);
  } else if (input.isPressed('left')) {
    // dino.move('left');
    jungle.move('right');
    dino.turn('left');
    dino.setState(CHARACTER_STATE.MOVING);
  } else {
    // reset character state
    dino.setState(CHARACTER_STATE.IDLE);
  }

  if (input.isPressed('run') && dino.isMoving()) {
    // dino.move(dino.getDirection()); // twice as fast, because we are calling move twice before dino.draw()
    jungle.move(jungle.getDirection());
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

  // drawing part  
  jungle.draw();
  dino.draw();

  // next game frame (recursive)
  requestAnimationFrame(runGame);
}