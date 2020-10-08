class Dom {
  constructor(selector) {
    this.$el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
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

  return container;
};

export { $ };
