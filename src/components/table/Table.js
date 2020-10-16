import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
} from '@core/utils';
import { $ } from '@core/dom';

import TableResize from './components/TableResize/TableResize';
import TableSelection from './components/TableSelection/TableSelection';

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
    this.tableSelection = new TableSelection(this.$root);
  }

  init() {
    super.init();
    this.tableSelection.selectInitialCell();
  }

  create() {
    this.englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create(
        'div', 'row',
        '', null,
        row ? ['resizable', '', true] : [],
        ['row', '', true], ['rowIndex', rowIndex, true],
      );
      const rowData = create('div', 'row-data', '', rowContainer);

      this.englishAlphabet.forEach((character, characterIndex) => {
        const columnResizeElement = create(
          'div', 'col-resize',
          '', null,
          ['resize', 'col', true],
        );
        const rowResize = create(
          'div', 'row-resize',
          '', null,
          ['resize', 'row', true],
        );

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
            ['selectCell', '', true], ['cellIndex', characterIndex, true],
            ['cellId', `${character}:${rowIndex}`, true],
            ['parentRowIndex', rowIndex, true],
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
    const resizer = $(event.target);
    const selector = $(event.target);

    if (TableSelection.shouldSelect(selector)) {
      this.tableSelection.selectCells(event, selector);
    }
    if (TableResize.shouldResize(resizer)) {
      this.tableResize.activateOnMousedownHandler(resizer);
    }
  }
}

export default Table;
