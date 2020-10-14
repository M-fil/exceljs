import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
} from '@core/utils';
import { $ } from '@core/dom';
import { shouldResize } from './helpers/helpers';

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
      listeners: ['mousedown', 'click'],
    });

    this.targetResizeElement = null;
    this.onMousedown = this.onMousedown.bind(this);
    this.onClick = this.onClick.bind(this);

    this.tableResize = new TableResize(this.$root, this.options.numberOfRows);
    this.tableSelection = new TableSelection();
  }

  create() {
    this.englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create(
        'div', 'row',
        '', null,
        row ? ['resizable', '', true] : [],
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
            ['selectCell', '', true], ['cellIndex', characterIndex],
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
    const targetSelector = selector.closest('[data-select-cell]');
    if (targetSelector) {
      this.tableSelection.removeSelectionGroup();
      this.tableSelection.select(targetSelector);

      document.onmousemove = (e) => {
        const currentSelector = $(e.target).closest('[data-select-cell]');
        if (currentSelector && !currentSelector.isHTMLLinkEquals(targetSelector)) {
          this.tableSelection.selectGroup(currentSelector);
        }
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
    if (shouldResize(resizer)) {
      this.tableResize.activateOnMousedownHandler(resizer);
    }
  }

  onClick(event) {
    const target = $(event.target).closest('[data-select-cell]');
    const { currentSelectedElement } = this.tableSelection.state;

    if (target && target.isHTMLLinkEquals(currentSelectedElement)) {
      this.tableSelection.select(target);
    }
  }
}

export default Table;
