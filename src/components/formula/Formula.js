import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';

class Formula extends ExcelComponent {
  static getClassName() {
    return 'excel__formula';
  }

  constructor($root) {
    super($root, {
      name: 'Formula',
      listeners: ['click', 'input'],
    });
  }

  onClick(event) {
    console.log('event', event);
  }

  onInput(event) {
    console.log(event)
  }

  toHTML() {
    create('div', 'info', 'fx', this.$root.$el);
    create('div', 'input', '', this.$root.$el, ['contenteditable', ''], ['spellcheck', false]);
  }
}
export default Formula;
