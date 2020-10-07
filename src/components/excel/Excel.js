class Excel {
  constructor(selector, options) {
    this.$rootContainer = document.querySelector(selector);
    this.components = options.components || [];
  }

  getRoot() {
    const root = document.createElement('div');
    root.classList.add('excel');

    this.components.forEach((Component) => {
      const element = document.createElement('div');
      const component = new Component(element);
      element.classList.add(Component.className);
      element.innerHTML = component.toHTML();

      root.append(element);
    });

    return root;
  }

  render() {
    this.$rootContainer.append(this.getRoot());
  }
}

export default Excel;
