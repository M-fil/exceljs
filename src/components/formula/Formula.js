import ExcelComponent from '@core/ExcelComponent';

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
    return `
      <div class="info">fx</div>
      <div class="input" contenteditable spellcheck="false"></div>
    `;
  }
}
export default Formula;
