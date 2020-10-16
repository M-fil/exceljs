import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';

class Header extends ExcelComponent {
  static getClassName() {
    return 'excel__header';
  }

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: [],
      ...options,
    });
  }

  toHTML() {
    const input = create('input', 'input', '', this.$root.$el, ['type', 'text'], ['value', 'Новая таблица']);
    const divContainer = document.createElement('div');
    create('div', 'button', create('i', 'material-icons', 'delete'), divContainer);
    create('div', 'button', create('i', 'material-icons', 'exit_to_app'), divContainer);
    this.$root.append(input);
    this.$root.append(divContainer);
  }
}

export default Header;
