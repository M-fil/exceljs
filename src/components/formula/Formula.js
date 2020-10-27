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

  static isFormulaText(value) {
    return value.startsWith('=');
  }

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['formulaText'],
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
      this.$dispatch(setFormulaText(text));
    });
    this.$on('table:cell-selection', (cell) => {
      const value = cell?.value || '';
      this.input.text(value);
      this.$dispatch(setFormulaText(value));
    });
    this.$on('table:calculate-value', (value) => {
      const result = value || '';
      this.input.text(result);
      this.$dispatch(setFormulaText(result));
    });
  }

  onInput(event) {
    const { targetCellId, cells } = this.$getState();

    const text = event.target.textContent.trim();
    this.$dispatch(saveTableCellData(targetCellId, {
      ...cells[targetCellId],
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
