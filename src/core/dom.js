class Dom {
  constructor(selector) {
    this.$el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    this.listeners = {};
  }

  html(html) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html;

      return this;
    }

    return this.$el.outerHTML.trim();
  }

  append(node) {
    let nodeCopy = node;
    if (node instanceof Dom) {
      nodeCopy = node.$el;
    }
    this.$el.append(nodeCopy);

    return this;
  }

  clear() {
    this.html('');

    return this;
  }

  on(eventType, callback) {
    if (eventType && callback) {
      this.listeners[eventType] = callback;
      this.$el.addEventListener(eventType, this.listeners[eventType]);
    } else {
      throw new Error('You need to provide eventType and callback to initialize an event listener!');
    }
  }

  off(eventType) {
    const eventListenerCallback = this.listeners[eventType];
    if (!eventListenerCallback || !eventType) {
      throw new Error(`The listener of type ${eventType} wasn't initialized!`);
    }

    this.$el.removeEventListener(eventType, eventListenerCallback);
    delete this.listeners[eventType];
  }
}

function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = '') => {
  const container = document.createElement(tagName);
  if (classes) {
    container.classList.add(classes);
  }

  return $(container);
};

export { $ };
