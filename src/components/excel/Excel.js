class Excel {
  constructor(selector, options) {
    this.$element = document.querySelector(selector);
    this.components = options.components || [];
  }
}

export default Excel;
