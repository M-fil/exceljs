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
      currentSelectedElement: null,
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
    this.state.currentSelectedElement = this.$root.findOne(
      TableSelection.getSelectedSelector('initial-cell'),
    );
    const { currentSelectedElement } = this.state;
    if (currentSelectedElement) {
      currentSelectedElement.focus();
      currentSelectedElement.addClasses('selected');
    }
  }

  select(targetElement) {
    if (this.state.currentSelectedElement) {
      this.removeSingleSelection();
    }

    if (targetElement) {
      this.state.currentSelectedElement = targetElement;
      const { currentSelectedElement } = this.state;

      if (currentSelectedElement) {
        currentSelectedElement
          .addClasses(TableSelection.getSelectedSelector('one'));
      }
    }
  }

  selectGroup(targetElement) {
    const startElementId = this.state.currentSelectedElement.getId(true);
    const targetElementId = targetElement.getId(true);

    const rows = TableSelection.createRange(
      Number(startElementId.row),
      Number(targetElementId.row),
    );
    const cols = TableSelection.createRange(
      getSymbolPositionInAlphabet(startElementId.col),
      getSymbolPositionInAlphabet(targetElementId.col),
    );

    const startElementShortId = this.state.currentSelectedElement.getId();
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
    this.state.currentSelectedElement.removeClasses(selectedClassName);
  }
}

export default TableSelection;
