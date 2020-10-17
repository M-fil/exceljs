import { $ } from '@core/dom';
import Emitter from '@core/Emitter';

class Excel {
  constructor(selector, options) {
    this.$rootContainer = document.querySelector(selector);
    this.components = options.components || [];
    this.emitter = new Emitter();
  }

  getRoot() {
    const root = $.create('div', 'excel');

    this.components = this.components.map((Component) => {
      const element = $.create('div', Component.getClassName());
      const component = new Component(element, {
        emitter: this.emitter,
      });
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
    });
  }

  destroy() {
    this.components.forEach((component) => {
      component.destroyEvents();
    });
  }
}

export default Excel;
