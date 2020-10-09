import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
} from '@core/utils';

class Table extends ExcelComponent {
  static getClassName() {
    return 'excel__table';
  }

  constructor($root) {
    super($root, {
      name: 'Table',
      numberOfRows: 30,
      listeners: [],
    });
  }

  create() {
    const englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create('div', 'row');
      const rowData = create('div', 'row-data', '', rowContainer);

      englishAlphabet.forEach((character, characterIndex) => {
        const columnResizeElement = create('div', 'col-resize');
        const rowResize = create('div', 'row-resize');

        if (characterIndex === 0) {
          create('div', 'row-info', [row ? String(row) : '', rowResize], rowData);
        } else if (rowIndex === 0) {
          create('div', 'column', [character, columnResizeElement], rowData);
        } else {
          create('div', 'cell', '', rowData, ['contenteditable', true]);
        }
      });

      this.$root.append(rowContainer);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toHTML() {
    this.create();
  }
}

export default Table;
