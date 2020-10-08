import { $ } from '@core/dom';

class Excel {
  constructor(selector, options) {
    this.$rootContainer = document.querySelector(selector);
    this.components = options.components || [];
  }

  getRoot() {
    const root = $.create('div', 'excel');

    this.components = this.components.map((Component) => {
      const element = $.create('div', Component.getClassName());
      const component = new Component(element);
      component.toHTML();
      root.append(element.$el);

      return component;
    });

    return root.$el;
  }

  render() {
    this.$rootContainer.append(this.getRoot());
    this.components.forEach((component) => {
      component.init();
      component.destroyEvents();
    });
  }
}

export default Excel;
