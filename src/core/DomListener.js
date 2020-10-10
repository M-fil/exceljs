import { capitalize } from './utils';

class DomListener {
  static getMethodName(method) {
    return `on${capitalize(method)}`;
  }

  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No root was provided for DomListener class!');
    }

    this.$root = $root;
    this.listeners = listeners;
  }

  initDOMListener() {
    this.listeners.forEach((listener) => {
      const method = DomListener.getMethodName(listener);

      if (!this[method] || !listener) {
        throw new Error(`You need to initialize the ${method} method in your ${this.options.name} component!`);
      }
      this.$root.on(listener, this[method]);
    });
  }

  removeDOMListener() {
    this.listeners.forEach((listener) => {
      const method = DomListener.getMethodName(listener);

      if (!this[method] || !listener) {
        throw new Error(`You need to initialize the ${method} method in your ${this.options.name} component!`);
      }
      this.$root.off(listener);
    });
  }
}

export default DomListener;
