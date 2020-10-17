class Emitter {
  constructor() {
    this.listeners = {};
  }

  emit(eventName, ...args) {
    if (Array.isArray(this.listeners[eventName])) {
      this.listeners[eventName].forEach((listener) => {
        listener(...args);
      });
    }
  }

  subscribe(eventName, func) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(func);

    return () => {
      this.listeners[eventName] = this.listeners[eventName]
        .filter((fn) => fn !== func);
    };
  }
}

export default Emitter;
