import Constants, { CHARACTER_STATE } from "./modules/Constants.js";
import imageLoader from "./modules/imageLoader.js";
import input from "./modules/Input.js";
import GameSubject from './modules/GameSubject.js';
import Meteor from './modules/Meteor.js';
import JungleBackground from './modules/JungleBackground.js';

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
let meteor;

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



// 3. Environment

let jungle;


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

  meteor = new Meteor(sprites.meteor, ctx, Constants.CANVAS_WIDTH / 2, -150);
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
    meteor = new Meteor(sprites.meteor, ctx, Constants.CANVAS_WIDTH / 2, -150);
  }

  // next game frame (recursive)
  requestAnimationFrame(runGame);
}