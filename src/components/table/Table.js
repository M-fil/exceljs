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
      listeners: ['mousedown'],
    });

    this.targetResizeElement = null;
  }

  create() {
    const englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create('div', 'row');
      const rowData = create('div', 'row-data', '', rowContainer);

      englishAlphabet.forEach((character, characterIndex) => {
        const columnResizeElement = create('div', 'col-resize', '', null, ['resize', 'col', true]);
        const rowResize = create('div', 'row-resize', '', null, ['resize', 'row', true]);

        if (characterIndex === 0) {
          create('div', 'row-info', [row ? String(row) : '', row && rowResize], rowData);
        } else if (rowIndex === 0) {
          create('div', 'column', [character, columnResizeElement], rowData, ['resizable', '', true]);
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

  onMousedown(event) {
    if (event.target.dataset.resize) {
      this.targetElement = event.target.closest('[data-resize]');
      const parentResizeElement = this.targetElement.closest('[data-resizable]');
      const targetElementCoords = parentResizeElement.getBoundingClientRect();

      document.onmousemove = (e) => {
        const delta = e.pageX - targetElementCoords.right;
        const newWidth = targetElementCoords.width + delta;
        parentResizeElement.style.width = `${newWidth}px`;
      };
    }

    document.onmouseup = () => {
      document.onmousemove = null;
    };
  }
}

export default Table;
