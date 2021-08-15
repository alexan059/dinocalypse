import Constants from "./modules/Constants.js";
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

let snail;

class Dino extends GameSubject {

  constructor(sprites, ctx, x = 0, y = 0, dir = 'right') {
    super(sprites, ctx, x, y, dir);
    this.SPRITE_SIZE = 24;
    this.SPRITE_SCALE = 3;
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

// TODO use dino sprite
// TODO make animated sprite
// TODO make animation states
// TODO add moving background and obstacles
// TODO collision detection

(async () => {

  sprites = await imageLoader(assets);

  console.log(sprites);

  setupGame();

  runGame();

})();


function setupGame() {

  snail = new Dino({ left: sprites.dino_L, right: sprites.dino_R }, ctx, 0, 45);
  // snail = new Snail({ left: sprites.snail_L, right: sprites.snail_R }, ctx, 0, 45)
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




