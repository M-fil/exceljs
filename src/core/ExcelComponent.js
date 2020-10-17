import DomListener from './DomListener';

class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);

    this.options = options;
    this.emitter = this.options.emitter;
    this.unSubscribers = [];

    this.$emit = this.$emit.bind(this);
    this.$on = this.$on.bind(this);
    this.$off = this.$off.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  toHTML() {
    return '';
  }

  $emit(eventName, ...args) {
    this.emitter.emit(eventName, ...args);
  }

  $on(eventName, fn) {
    const unSubFunc = this.emitter.subscribe(eventName, fn);
    this.unSubscribers.push(unSubFunc);
  }

  $off() {
    this.unSubscribers.forEach((unSubFunc) => {
      unSubFunc();
    });
  }

  init() {
    this.initDOMListener();
  }

  destroyEvents() {
    this.removeDOMListener();
  }
}

export default ExcelComponent;
