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

    this.tableState = storage('excel-state')?.tableState || null;
  }

  init() {
    super.init();
    this.selection.selectInitialCell();
    const { current } = this.selection.state;
    const targetCellId = current.getId();
    this.$dispatch(setTargetCellId(targetCellId, {
      value: current.content,
    }));
    this.$on('formula:confirm-text', () => {
      current.focus();
    });
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
      const targetId = targetSelector.getId();
      this.$dispatch(setTargetCellId(targetId));
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
      const cellId = this.selection.state.current.getId();
      this.$dispatch(setTargetCellId(cellId));
    }
  }

  onInput(event) {
    const target = $(event.target);
    const targetCell = TableSelection.shouldSelect(target);

    if (targetCell) {
      const cellId = targetCell.getId();
      this.$dispatch(saveTableCellData(cellId, {
        value: targetCell.content,
      }));
    }
  }
}

export default Table;
