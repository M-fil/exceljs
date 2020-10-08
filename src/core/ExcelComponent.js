import DomListener from './DomListener';

class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);

    this.options = options;
  }

  toHTML() {
    return '';
  }

  init() {
    this.initDOMListener();
  }

  destroyEvents() {
    this.removeDOMListener();
  }
}

export default ExcelComponent;
