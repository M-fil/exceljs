import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import {
  getEnglishAlphabetArray,
  getArrayOfNumber,
  storage,
} from '@core/utils';
import { $ } from '@core/dom';

import TableResize from './components/TableResize/TableResize';
import TableSelection from './components/TableSelection/TableSelection';
import TableKeyboardControl from './components/TableKeyboardControl/TableKeyboardControl';
import { tableActionTypes } from '../../redux/actionTypes';

const {
  SAVE_TABLE_RESIZE_COL_VALUES,
  SAVE_TABLE_RESIZE_ROW_VALUES,
} = tableActionTypes;

class Table extends ExcelComponent {
  static getClassName() {
    return 'excel__table';
  }

  constructor($root, optionsObject) {
    super($root, {
      name: 'Table',
      numberOfRows: 20,
      listeners: ['mousedown', 'keydown', 'input'],
      ...optionsObject,
    });

    this.targetResizeElement = null;
    this.onMousedown = this.onMousedown.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onInput = this.onInput.bind(this);

    this.resize = new TableResize(this.$root, this.options.numberOfRows);
    this.selection = new TableSelection(this.$root, this.keyboardControl);
    this.keyboardControl = new TableKeyboardControl(this.selection)
      .setNumberOfRows(this.options.numberOfRows);

    this.tableState = storage('excel-state')?.tableState || null;
  }

  init() {
    super.init();
    this.selection.selectInitialCell();
    const { current } = this.selection.state;
    this.$emit('formula:insert-content', current.content);
    this.$on('formula:input', (content) => {
      current.text(content);
    });
    this.$on('formula:confirm-text', () => {
      current.focus();
    });
  }

  create() {
    this.englishAlphabet = [null, ...getEnglishAlphabetArray()];
    const rows = [null, ...getArrayOfNumber(this.options.numberOfRows)];

    rows.forEach((row, rowIndex) => {
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
      const rowData = create('div', 'row-data', '', rowContainer);

      this.englishAlphabet.forEach((character, characterIndex) => {
        const colFromStorage = this.tableState.cols && this.tableState.cols[character];
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
          const columnElement = create(
            'div', 'column',
            [character, columnResizeElement], rowData,
            ['resizable', '', true], ['colName', character, true],
          );
          if (colFromStorage) {
            $(columnElement).css({ width: `${colFromStorage.width}px` });
          }
        } else {
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
      });

      this.$root.append(rowContainer);
    });
  }

  toHTML() {
    this.create();
  }

  async resizeTable(resizer) {
    const data = await this.resize.activateOnMousedownHandler(resizer);
    const propToDispatch = data.width ? 'width' : 'height';
    this.$dispatch({
      type: data.width ? SAVE_TABLE_RESIZE_COL_VALUES : SAVE_TABLE_RESIZE_ROW_VALUES,
      payload: {
        id: data.id,
        [propToDispatch]: data[propToDispatch],
      },
    });
  }

  onMousedown(event) {
    const resizer = $(event.target);
    const selector = $(event.target);
    const targetSelector = TableSelection.shouldSelect(selector);

    if (targetSelector) {
      this.$emit('formula:insert-content', targetSelector.content);
      this.selection.selectCells(event, selector);
    }
    if (TableResize.shouldResize(resizer)) {
      this.resizeTable(resizer);
    }
  }

  onKeydown(event) {
    const { key } = event;
    if (TableKeyboardControl.isAllowToPressKey(event)) {
      event.preventDefault();

      const { current } = this.selection.state;
      this.keyboardControl.moveSelectionByArrowClick(key, current);
      this.$emit('formula:insert-content', this.selection.state.current.content);
    }
  }

  onInput(event) {
    const target = $(event.target);
    const targetCell = TableSelection.shouldSelect(target);

    if (targetCell) {
      this.$emit('table:cell-input', targetCell.content);
    }
  }
}

export default Table;
