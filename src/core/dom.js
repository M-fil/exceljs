export class Dom {
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

  findAll(selector) {
    const elements = this.$el && Array.from(this.$el.querySelectorAll(selector));
    return elements.length && elements.map((elem) => $(elem));
  }

  findOne(selector) {
    return $(this.$el?.querySelector(selector));
  }

  getCoords() {
    return this.$el.getBoundingClientRect();
  }

  get dataAttr() {
    return this.$el?.dataset;
  }

  closest(selector) {
    return $(this.$el.closest(selector));
  }

  hasClass(className) {
    return this.$el?.classList.contains(className);
  }

  addClasses(...classes) {
    if (this.$el) {
      this.$el.classList.add(...classes);
      return this;
    }

    return null;
  }

  removeClasses(...classes) {
    if (this.$el) {
      this.$el.classList.remove(...classes);
      return this;
    }

    return null;
  }

  isHTMLLinkEquals(htmlElement) {
    return this.$el === htmlElement || this.$el === htmlElement?.$el;
  }

  css(styles = {}) {
    Object.keys(styles).forEach((prop) => {
      if (prop in styles) {
        this.$el.style[prop] = styles[prop];
      }
    });

    return this;
  }

  getId(parse, idName = 'cellId') {
    if (parse) {
      const id = this.getId().split(':');
      const col = id[0];
      const row = id[1];

      return { col, row };
    }

    return this.$el.dataset[idName];
  }

  get offsetHeight() {
    return this.$el.offsetHeight;
  }

  get offsetWidth() {
    return this.$el.offsetWidth;
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
