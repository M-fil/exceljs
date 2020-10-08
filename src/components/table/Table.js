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
      listeners: [],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toHTML() {
    const englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(20)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create('div', 'row');
      const rowData = create('div', 'row-data', '', rowContainer);

      englishAlphabet.forEach((character, characterIndex) => {
        if (characterIndex === 0) {
          create('div', 'column', row ? String(row) : '', rowData);
        } else if (rowIndex === 0) {
          create('div', 'column', character, rowData);
        } else {
          create('div', 'column', '', rowData);
        }
      });

      this.$root.append(rowContainer);
    });
  }
}

export default Table;
