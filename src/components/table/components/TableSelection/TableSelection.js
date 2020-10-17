import {
  getSymbolPositionInAlphabet,
  getSymbolByPositionInAlphabet,
  getEnglishAlphabetLength,
} from '@core/utils';

class TableSelection {
  static shouldSelect(selector) {
    return selector.closest('[data-select-cell]');
  }

  static getSelectedSelector(type) {
    switch (type) {
      case 'one':
      default:
        return 'selected';
      case 'group':
        return 'group-selected';
      case 'initial-cell':
        return '[data-cell-id="A:1"]';
    }
  }

  static createRange(start, end) {
    if (start > end) {
      [end, start] = [start, end];
    }
    const length = end - start + 1;
    return Array.from({ length })
      .map((_, index) => start + index);
  }

  static getPermittedKeyboardKeys() {
    return ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Tab', 'Enter'];
  }

  constructor($root) {
    this.$root = $root;
    this.state = {
      current: null,
      selectedElements: [],
    };

    this.permittedKeys = TableSelection.getPermittedKeyboardKeys();
    this.englishAlphabetLength = getEnglishAlphabetLength();
  }

  selectCells(event, selector) {
    const targetSelector = selector.closest('[data-select-cell]');
    this.removeSelectionGroup();
    if (event.shiftKey) {
      this.selectGroup(targetSelector);
    } else {
      this.select(targetSelector);
    }
  }

  selectInitialCell() {
    this.state.current = this.$root.findOne(
      TableSelection.getSelectedSelector('initial-cell'),
    );
    const { current } = this.state;
    if (current) {
      current.focus();
      current.addClasses('selected');
    }
  }

  selectByCoords(col, row) {
    const newSelectedElement = this.$root.findOne(`[data-cell-id="${col}:${row}"]`);
    if (newSelectedElement) {
      this.select(newSelectedElement);
    }
  }

  select(targetElement) {
    if (this.state.current) {
      this.removeSingleSelection();
    }

    if (targetElement) {
      this.state.current = targetElement;
      const { current } = this.state;

      if (current) {
        current
          .addClasses(TableSelection.getSelectedSelector('one'));
        current.focus();
      }
    }
  }

  selectGroup(targetElement) {
    const startElementId = this.state.current.getId(true);
    const targetElementId = targetElement.getId(true);

    const rows = TableSelection.createRange(
      Number(startElementId.row),
      Number(targetElementId.row),
    );
    const cols = TableSelection.createRange(
      getSymbolPositionInAlphabet(startElementId.col),
      getSymbolPositionInAlphabet(targetElementId.col),
    );

    const startElementShortId = this.state.current.getId();
    const ids = rows.reduce((acc, curRow) => {
      cols.forEach((col) => acc.push(`${getSymbolByPositionInAlphabet(col)}:${curRow}`));
      return acc;
    }, []);
    this.state.selectedElements = ids.map((id) => this.$root.findOne(`[data-cell-id="${id}"]`));
    this.state.selectedElements.forEach((element) => {
      if (element.dataAttr.cellId !== startElementShortId) {
        element.addClasses(TableSelection.getSelectedSelector('group'));
      }
    });
  }

  removeSelectionGroup() {
    const { selectedElements } = this.state;
    if (selectedElements.length) {
      const groupSelectionClassName = TableSelection.getSelectedSelector('group');
      selectedElements.forEach((element) => {
        element.removeClasses(groupSelectionClassName);
      });
    }
  }

  removeSingleSelection() {
    const selectedClassName = TableSelection.getSelectedSelector('one');
    this.state.current.removeClasses(selectedClassName);
  }
}

export default TableSelection;
