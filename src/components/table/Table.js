import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
} from '@core/utils';
import TableResize from './components/TableResize/TableResize';

class Table extends ExcelComponent {
  static getClassName() {
    return 'excel__table';
  }

  constructor($root) {
    super($root, {
      name: 'Table',
      numberOfRows: 20,
      listeners: ['mousedown'],
    });

    this.targetResizeElement = null;
    this.onMousedown = this.onMousedown.bind(this);
    this.tableResize = new TableResize(this.$root, this.options.numberOfRows);
  }

  create() {
    this.englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create('div', 'row', '', null, row ? ['resizable', '', true] : []);
      const rowData = create('div', 'row-data', '', rowContainer);

      this.englishAlphabet.forEach((character, characterIndex) => {
        const columnResizeElement = create('div', 'col-resize', '', null, ['resize', 'col', true]);
        const rowResize = create('div', 'row-resize', '', null, ['resize', 'row', true]);

        if (characterIndex === 0) {
          create(
            'div', 'row-info',
            [row ? String(row) : '', row && rowResize], rowData,
          );
        } else if (rowIndex === 0) {
          create(
            'div', 'column',
            [character, columnResizeElement], rowData,
            ['resizable', '', true], ['colName', character, true],
          );
        } else {
          create(
            'div', 'cell',
            '', rowData,
            ['contenteditable', true], ['parentColName', character, true],
          );
        }
      });

      this.$root.append(rowContainer);
    });
  }

  toHTML() {
    this.create();
  }

  onMousedown(event) {
    this.tableResize.activateOnMousedownHandler(event);
  }
}

export default Table;
