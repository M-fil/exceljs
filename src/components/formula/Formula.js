import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';

import {
  saveTableCellData,
  setFormulaText,
} from '../../redux/actions';

class Formula extends ExcelComponent {
  static getClassName() {
    return 'excel__formula';
  }

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['targetCell'],
      ...options,
    });

    this.onInput = this.onInput.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }

  init() {
    super.init();
    this.input = this.$root.findOne('.input');
    this.$on('table:cell-text-input', (text) => {
      this.input.text(text);
    });
    this.$on('table:cell-selection', (text) => {
      this.input.text(text);
    });
  }

  storeChanged(changes) {
    console.log('changes', changes);
  }

  onInput(event) {
    const text = event.target.textContent.trim();
    this.$dispatch(saveTableCellData(this.cellId, {
      value: text,
    }));
    this.$dispatch(setFormulaText(text));
    this.$emit('formula:text-input', text);
  }

  onKeydown(event) {
    const { key } = event;
    if (key === 'Enter') {
      event.preventDefault();
      this.$emit('formula:confirm-text');
    }
  }

  toHTML() {
    create('div', 'info', 'fx', this.$root.$el);
    create(
      'div', 'input',
      '', this.$root.$el,
      ['contenteditable', ''], ['spellcheck', false],
    );
  }
}
export default Formula;
