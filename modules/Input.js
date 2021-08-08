class Input {

  constructor() {
    this._keypressed = [];

    window.addEventListener('keydown', this._keydownEvents.bind(this));
    window.addEventListener('keyup', this._keyupEvents.bind(this));
  }

  isPressed(key) {
    return this._keypressed.includes(key);
  }

  _keydownEvents(e) {
    switch (e.code) {
      case 'ArrowRight':
        this._keypressed.push('right');
        break;
      case 'ArrowLeft':
        this._keypressed.push('left');
        break;
      case 'ArrowUp':
        this._keypressed.push('jump');
        break;
    }
  }

  _keyupEvents(e) {
    switch (e.code) {
      case 'ArrowRight':
        this._keypressed = this._keypressed.filter(k => k !== 'right');
        break;
      case 'ArrowLeft':
        this._keypressed = this._keypressed.filter(k => k !== 'left');
        break;
      case 'ArrowUp':
        this._keypressed = this._keypressed.filter(k => k !== 'jump');
        break;
    }
  }

}

const input = new Input();

export default input;