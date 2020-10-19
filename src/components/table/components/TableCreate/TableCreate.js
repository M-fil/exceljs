import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
  storage,
} from '@core/utils';
import { $ } from '@core/dom';

class TableCreate {
  constructor($root, numberOfRows) {
    this.$root = $root;
    this.numberOfRows = numberOfRows;

    this.tableState = storage('excel-state')?.tableState || null;
  }

  createRowInfo(row, rowResize, rowData) {
    this.rowInfo = create(
      'div', 'row-info',
      [row ? String(row) : '', row && rowResize], rowData,
    );
  }

  createColumnElement(character, columnResizeElement, rowData) {
    const colFromStorage = this.tableState.cols && this.tableState.cols[character];

    const columnElement = create(
      'div', 'column',
      [character, columnResizeElement], rowData,
      ['resizable', '', true], ['colName', character, true],
    );
    if (colFromStorage) {
      $(columnElement).css({ width: `${colFromStorage.width}px` });
    }
  }

  createCellElement(character, characterIndex, rowIndex, rowData) {
    const colFromStorage = this.tableState.cols && this.tableState.cols[character];

    const cellElement = create(
      'div', 'cell',
      '', rowData,
      ['contenteditable', true], ['parentColName', character, true],
      ['selectCell', '', true], ['cellIndex', characterIndex, true],
      ['cellId', `${character}:${rowIndex}`, true],
      ['parentRowIndex', rowIndex, true],
    );
    if (colFromStorage) {
      $(cellElement).css({ width: `${colFromStorage.width}px` });
    }
  }

  createRowContainer(row, rowIndex) {
    const rowFromStorage = this.tableState.rows && this.tableState.rows[rowIndex];

    const rowContainer = create(
      'div', 'row',
      '', null,
      row ? ['resizable', '', true] : [],
      ['row', '', true], ['rowIndex', rowIndex, true],
    );
    if (rowFromStorage) {
      $(rowContainer).css({ height: `${rowFromStorage.height}px` });
    }

    return rowContainer;
  }

  createTable() {
    this.englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.numberOfRows)];

    rows.forEach((row, rowIndex) => {
      const rowContainer = this.createRowContainer(row, rowIndex);
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
          this.createRowInfo(row, rowResize, rowData);
        } else if (rowIndex === 0) {
          this.createColumnElement(character, columnResizeElement, rowData);
        } else {
          this.createCellElement(character, characterIndex, rowIndex, rowData);
        }
      });

      this.$root.append(rowContainer);
    });
  }
}

export default TableCreate;
