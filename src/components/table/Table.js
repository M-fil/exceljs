import ExcelComponent from '@core/ExcelComponent';
import { storage } from '@core/utils';
import { $ } from '@core/dom';

import TableResize from './components/TableResize/TableResize';
import TableSelection from './components/TableSelection/TableSelection';
import TableKeyboardControl from './components/TableKeyboardControl/TableKeyboardControl';
import TableCreate from './components/TableCreate/TableCreate';

import {
  saveTableResize,
  saveTableCellData,
  setTargetCellId,
} from '../../redux/actions';

class Table extends ExcelComponent {
  static getClassName() {
    return 'excel__table';
  }

  constructor($root, optionsObject) {
    super($root, {
      name: 'Table',
      numberOfRows: 20,
      listeners: ['mousedown', 'keydown', 'input'],
      subscribe: ['cols', 'rows', 'targetCellId'],
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
    this.creator = new TableCreate(this.$root, this.options.numberOfRows);

    this.tableState = storage('excel-state') || null;
  }

  init() {
    super.init();
    this.selection.selectInitialCell();
    const { current } = this.selection.state;
    const targetCellId = current.getId();
    const targetCell = this.tableState.cells[targetCellId];

    this.$dispatch(setTargetCellId(targetCellId, {
      value: current.content,
    }));
    this.$on('formula:confirm-text', () => {
      current.focus();
    });
    this.$on('formula:text-input', (text) => {
      this.selection.state.current.text(text);
    });
    this.$on('toolbar:button-click', (changes, cell) => {
      const fullDataCell = { ...cell, ...changes };
      console.log('fullDataCell', fullDataCell);
      this.selection.state.current.css({
        'text-align': fullDataCell.align,
        'font-weight': fullDataCell.isBold ? 'bold' : 'initial',
        'font-style': fullDataCell.isItalic ? 'italic' : 'initial',
        'text-decoration': fullDataCell.isUnderlined ? 'underline' : 'initial',
      });
    });
    this.$emit('table:cell-selection', targetCell);
  }

  toHTML() {
    this.creator.createTable();
  }

  async resizeTable(resizer) {
    const resizeData = await this.resize.activateOnMousedownHandler(resizer);
    const propToDispatch = resizeData.width ? 'width' : 'height';
    this.$dispatch(saveTableResize(resizeData, propToDispatch));
  }

  onMousedown(event) {
    const resizer = $(event.target);
    const selector = $(event.target);
    const targetSelector = TableSelection.shouldSelect(selector);

    if (targetSelector) {
      const { cells } = this.$getState();
      const targetId = targetSelector.getId();
      this.$dispatch(setTargetCellId(targetId));
      this.selection.selectCells(event, selector);
      this.$emit('table:cell-selection', cells[targetId]);
    }
    if (TableResize.shouldResize(resizer)) {
      this.resizeTable(resizer);
    }
  }

  onKeydown(event) {
    const { key } = event;
    if (TableKeyboardControl.isAllowToPressKey(event)) {
      event.preventDefault();

      const { cells } = this.$getState();
      const { current } = this.selection.state;
      this.keyboardControl.moveSelectionByArrowClick(key, current);
      const cellId = this.selection.state.current.getId();
      this.$dispatch(setTargetCellId(cellId));
      this.$emit('table:cell-selection', cells[cellId] || {});
    }
  }

  onInput(event) {
    const target = $(event.target);
    const targetCell = TableSelection.shouldSelect(target);
    this.$emit('table:cell-text-input', targetCell.content);

    if (targetCell) {
      const cellId = targetCell.getId();
      this.$dispatch(saveTableCellData(cellId, {
        ...this.tableState.cells[cellId],
        value: targetCell.content,
      }));
    }
  }
}

export default Table;
