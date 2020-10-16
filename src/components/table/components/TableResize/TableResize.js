import { getEnglishAlphabetLength } from '@core/utils';

class TableResize {
  static shouldResize(resizer) {
    return resizer && resizer.dataAttr.resize;
  }

  constructor($root, numberOfRows) {
    this.$root = $root;
    this.numberOfRows = numberOfRows;

    this.englishAlphabetLength = getEnglishAlphabetLength();
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

  changeRowSize(resizer, resizerCoords, event) {
    const delta = event.clientY - this.targetElementCoords.bottom;
    let newHeight = this.targetElementCoords.height + delta;
    if (newHeight < resizerCoords.height) {
      newHeight = resizerCoords.height;
    }

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
    const resizerHeight = this.parentResizeElement.offsetHeight * this.numberOfRows;
    resizer.css({
      right: `${-delta}px`,
      height: `${resizerHeight}px`,
      width: '2px',
      transform: `translateY(${resizerHeight}px)`,
    });
  }

  moveResizeRowLine(resizer, resizerCoords, e) {
    const delta = e.pageY - resizerCoords.bottom;
    const resizerWidth = this.parentResizeElement.offsetWidth * this.englishAlphabetLength;
    resizer.css({
      bottom: `${-delta}px`,
      width: `${resizerWidth}px`,
      height: '2px',
    });
  }

  activateOnMousedownHandler(resizer) {
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

    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;

      if (this.resizeType === 'col') {
        this.changeColumnSize(resizer, e);
        if (this.parentResizeElement) {
          this.removeColResizableHighlight();
        }
      } else {
        this.changeRowSize(resizer, resizerCoords, e);
        if (this.parentResizeElement) {
          this.removeRowResizableHighlight();
        }
      }
    };
  }
}

export default TableResize;
