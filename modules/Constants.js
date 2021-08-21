class Constants {
  static CANVAS_WIDTH = 500;
  static CANVAS_HEIGHT = 500;
}

// like c enum
const CHARACTER_STATE = {
  IDLE: 0, // common term for doing nothing, in our game it's like standing
  MOVING: 1,
  RUNNING: 2,
  JUMPING: 3
}

export default Constants;

export {
  CHARACTER_STATE
}