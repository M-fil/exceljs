class Dom {
  constructor(selector) {
    this.$el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
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
      this[`${eventType}Listener`] = callback;
      this.$el.addEventListener(eventType, this[`${eventType}Listener`]);
    } else {
      throw new Error('You need to provide eventType and callback to initialize an event listener!');
    }
  }

  off(eventType) {
    const eventListenerCallback = this[`${eventType}Listener`];
    if (!eventListenerCallback || !eventType) {
      throw new Error(`The listener of type ${eventType} wasn't initialized!`);
    }

    this.$el.removeEventListener(eventType, eventListenerCallback);
    this[`${eventType}Listener`] = null;
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
