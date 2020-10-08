import { $ } from '@core/dom';

class Excel {
  constructor(selector, options) {
    this.$rootContainer = document.querySelector(selector);
    this.components = options.components || [];
  }

  getRoot() {
    const root = $.create('div', 'excel');

    this.components.forEach((Component) => {
      const element = $.create('div', Component.className);
      const component = new Component(element);
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
