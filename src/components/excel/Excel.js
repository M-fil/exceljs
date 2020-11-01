import { $ } from '@core/dom';
import Emitter from '@core/Emitter';
import StoreSubscriber from '@core/StoreSubscriber';

class Excel {
  constructor(options) {
    this.components = options.components || [];

    this.store = options.store;
    this.emitter = new Emitter();
    this.subscriber = new StoreSubscriber(this.store);
  }

  getRoot() {
    const root = $.create('div', 'excel');
    const componentOptions = {
      emitter: this.emitter,
      store: this.store,
    };

    this.components = this.components.map((Component) => {
      const element = $.create('div', Component.getClassName());
      const component = new Component(element, componentOptions);
      component.toHTML();
      root.append(element.$el);

      return component;
    });

    return root.$el;
  }

  init() {
    this.components.forEach((component) => {
      component.init();
    });
    this.subscriber.subscribeComponents(this.components);
  }

  destroy() {
    this.components.forEach((component) => {
      component.destroyEvents();
    });
    this.subscriber.unSubscribeFromStore();
  }
}

export default Excel;
