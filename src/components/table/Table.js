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
      numberOfRows: 20,
      listeners: ['mousedown'],
    });

    this.targetResizeElement = null;
    this.onMousedown = this.onMousedown.bind(this);
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

  changeColumnSize(resizer, event) {
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

    resizer.css({
      right: '-3px',
      height: '100%',
      width: '6px',
      transform: 'translateY(0)',
    });
  }

  changeRowSize(resizer, event) {
    const delta = event.clientY - this.targetElementCoords.bottom;
    const newHeight = this.targetElementCoords.height + delta;
    this.parentResizeElement.findOne('[data-resize]').addClasses('visible');
    this.parentResizeElement.css({ height: `${newHeight}px` });
    this.parentResizeElement.addClasses('resizable');

    resizer.css({
      bottom: '-3px',
      width: '100%',
      height: '6px',
      transform: 'translateX(0)',
    });
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

  removeRowResizableHighlight() {
    this.parentResizeElement.removeClasses('resizable');
    this.parentResizeElement.findOne('[data-resize]').removeClasses('visible');
  }

  moveResizeColLine(resizer, resizerCoords, e) {
    const delta = e.pageX - resizerCoords.right;
    const resizerHeight = this.parentResizeElement.offsetHeight * this.options.numberOfRows;
    resizer.css({
      right: `${-delta}px`,
      height: `${resizerHeight}px`,
      width: '2px',
      transform: `translateY(${resizerHeight}px)`,
    });
  }

  moveResizeRowLine(resizer, resizerCoords, e) {
    const delta = e.pageY - resizerCoords.bottom;
    const resizerWidth = this.parentResizeElement.offsetWidth * this.englishAlphabet.length;
    resizer.css({
      bottom: `${-delta}px`,
      width: `${resizerWidth}px`,
      height: '2px',
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
      const resizerCoords = resizer.getCoords();

      this.allColumnChildren = this.$root
        .findAll(`[data-parent-${this.resizeType}-name="${this.colName}"]`);
      this.targetColumnHead = this.$root
        .findOne(`[data-col-name="${this.colName}"]`);
      this.targetDataResize = this.targetColumnHead
        .findOne('[data-resize]');

      document.onmousemove = (e) => {
        resizer.addClasses('visible');

        if (this.resizeType === 'col') {
          this.moveResizeColLine(resizer, resizerCoords, e);
        } else {
          this.moveResizeRowLine(resizer, resizerCoords, e);
        }
      };
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;

      if (this.resizeType === 'col') {
        this.changeColumnSize(resizer, e);
        if (this.parentResizeElement) {
          this.removeColResizableHighlight();
        }
      } else {
        this.changeRowSize(resizer, e);
        if (this.parentResizeElement) {
          this.removeRowResizableHighlight();
        }
      }
    };
  }
}

export default Table;
