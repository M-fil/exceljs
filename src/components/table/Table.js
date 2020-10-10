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
    this.onMousedown = this.onMousedown.bind(this);
  }

  create() {
    const englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = create('div', 'row', '', null, row ? ['resizable', '', true] : []);
      const rowData = create('div', 'row-data', '', rowContainer);

      englishAlphabet.forEach((character, characterIndex) => {
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

  changeColumnSize(documentEvent) {
    const targetElementCoords = this.parentResizeElement.getBoundingClientRect();
    const { colName } = this.parentResizeElement.dataset;

    const delta = documentEvent.pageX - targetElementCoords.right;
    const newWidth = targetElementCoords.width + delta;

    this.parentResizeElement.style.width = `${newWidth}px`;
    const allColumnChildren = document
      .querySelectorAll(`[data-parent-col-name="${colName}"]`);
    const targetColumnHead = document.querySelector(`[data-col-name="${colName}"]`);
    targetColumnHead.querySelector('[data-resize]').classList.add('visible');

    Array.from(allColumnChildren).forEach((column) => {
      column.style.width = `${newWidth}px`;
      column.classList.add('resizable');
    });
  }

  changeRowSize(documentEvent) {
    const targetElementCoords = this.parentResizeElement.getBoundingClientRect();
    const delta = documentEvent.pageY - targetElementCoords.bottom;
    const newHeight = targetElementCoords.height + delta;
    this.parentResizeElement.querySelector('[data-resize]').classList.add('visible');
    this.parentResizeElement.style.height = `${newHeight}px`;
    this.parentResizeElement.classList.add('resizable');
  }

  removeColResizableHighlight() {
    const { colName } = this.parentResizeElement?.dataset;
    const allColumnChildren = document
      .querySelectorAll(`[data-parent-col-name="${colName}"]`);
    const targetColumnHead = document.querySelector(`[data-col-name="${colName}"]`);
    targetColumnHead?.querySelector('[data-resize]').classList.remove('visible');

    Array.from(allColumnChildren).forEach((column) => {
      column.classList.remove('resizable');
      this.parentResizeElement.classList.remove('visible');
    });
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      this.targetElement = event.target.closest('[data-resize]');
      const resizeType = this.targetElement.dataset.resize;
      this.parentResizeElement = this.targetElement.closest('[data-resizable]');

      document.onmousemove = (e) => {
        if (resizeType === 'col') {
          this.changeColumnSize(e);
        } else {
          this.changeRowSize(e);
        }
      };
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      this.removeColResizableHighlight();
      this.parentResizeElement.classList.remove('resizable');
      this.parentResizeElement.querySelector('[data-resize]').classList.remove('visible');
    };
  }
}

export default Table;
