import DomListener from './DomListener';

class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);

    this.options = options;
    this.emitter = this.options.emitter;
    this.store = this.options.store;
    this.unSubscribers = [];
    this.storeSub = null;
    this.subscribe = options.subscribe || [];

    this.$emit = this.$emit.bind(this);
    this.$on = this.$on.bind(this);
    this.$off = this.$off.bind(this);
    this.$dispatch = this.$dispatch.bind(this);
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

  $dispatch(action) {
    this.store.dispatch(action);
  }

  $getState() {
    return this.store.getState();
  }

  init() {
    this.initDOMListener();
  }

  storeChanged(changes) {
    // console.log('changes', changes);
  }

  destroyEvents() {
    this.removeDOMListener();
    this.storeSub.unSubscribe();
  }
}

export default ExcelComponent;
