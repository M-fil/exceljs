import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
} from '@core/utils';
import { $ } from '@core/dom';

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

  changeColumnSize(event) {
    const delta = event.clientX - this.targetElementCoords.right;
    const newWidth = this.targetElementCoords.width + delta;
    this.parentResizeElement.css({ width: `${newWidth}px` });

    if (this.targetDataResize) {
      this.targetDataResize.addClasses('visible');
    }

    this.allColumnChildren.forEach((column) => {
      column.css({ width: `${newWidth}px` });
      column.addClasses('resizable');
    });
  }

  changeRowSize(event) {
    const delta = event.clientY - this.targetElementCoords.bottom;
    const newHeight = this.targetElementCoords.height + delta;
    this.parentResizeElement.findOne('[data-resize]').addClasses('visible');
    this.parentResizeElement.css({ height: `${newHeight}px` });
    this.parentResizeElement.addClasses('resizable');
  }

  removeColResizableHighlight() {
    if (this.targetDataResize) {
      this.targetDataResize.removeClasses('visible');
    }

    this.allColumnChildren.forEach((column) => {
      column.removeClasses('resizable');
      this.parentResizeElement.removeClasses('visible');
    });
  }

  onMousedown(event) {
    const resizer = $(event.target);
    if (resizer && resizer.dataAttr.resize) {
      const targetElement = resizer.closest('[data-resize]');
      this.resizeType = targetElement.dataAttr.resize;
      this.parentResizeElement = targetElement.closest('[data-resizable]');
      this.colName = this.parentResizeElement.dataAttr.colName;
      this.targetElementCoords = this.parentResizeElement.getCoords();

      this.allColumnChildren = this.$root
        .findAll(`[data-parent-col-name="${this.colName}"]`);
      this.targetColumnHead = this.$root
        .findOne(`[data-col-name="${this.colName}"]`);
      this.targetDataResize = this.targetColumnHead
        .findOne('[data-resize]');

      document.onmousemove = (e) => {
        if (this.resizeType === 'col') {
          this.changeColumnSize(e);
        } else {
          this.changeRowSize(e);
        }
      };
    }

    document.onmouseup = () => {
      document.onmousemove = null;

      if (this.parentResizeElement) {
        if (this.resizeType === 'col') {
          this.removeColResizableHighlight();
        } else {
          this.parentResizeElement.removeClasses('resizable');
          this.parentResizeElement.findOne('[data-resize]').removeClasses('visible');
        }
      }
    };
  }
}

export default Table;
