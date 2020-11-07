import { $ } from '@core/dom';
import create from '@core/create';

class Loader {
  constructor() {
    this.loader = $(document.body).findOne('.loader-container');
  }

  isLoader() {
    return this.loader && this.loader.isElement();
  }

  updateLoaderContainer() {
    this.loader = $(document.body).findOne('.loader-container');
  }

  renderItems(numberOfItems) {
    return Array.from({ length: numberOfItems }).map((_) => create('div'));
  }

  render() {
    const loaderContainer = create('div', 'loader-container');
    const container = create('div', 'loadingio-spinner-reload-ph1pwpq1dkg', '', loaderContainer);
    const innerWrapper = create('div', 'ldio-4hg425v7lqe', '', container);
    create('div', '', this.renderItems(3), innerWrapper);

    return loaderContainer;
  }

  show() {
    if (this.isLoader()) {
      this.loader.addClasses('visible')
    } else {
      document.body.append(this.render());
      this.updateLoaderContainer();
      this.loader.addClasses('visible')
    }
  }

  hide() {
    if (this.isLoader()) {
      this.loader.removeClasses('visible');
    }
  }
}

export default Loader;