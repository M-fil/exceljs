import {
  getSymbolPositionInAlphabet,
  getSymbolByPositionInAlphabet,
  getEnglishAlphabetLength,
} from '@core/utils';

class TableKeyboardControl {
  static getPermittedKeyboardKeys() {
    return ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Tab', 'Enter'];
  }

  static isAllowToPressKey(event) {
    const keys = TableKeyboardControl.getPermittedKeyboardKeys();
    return keys.includes(event.key) && !event.shiftKey;
  }

  constructor(tableSelection) {
    this.tableSelection = tableSelection;
    this.$root = this.tableSelection.$root;

    this.permittedKeys = TableKeyboardControl.getPermittedKeyboardKeys();
    this.englishAlphabetLength = getEnglishAlphabetLength();
  }

  setNumberOfRows(numberOfRows) {
    try {
      this.numberOfRows = parseInt(numberOfRows, 10);
      return this;
    } catch {
      throw new Error('numberOfRows should be a number');
    }
  }

  selectElementByArrowKeyName(arrowKeyName) {
    const { currentSelectedElement } = this.tableSelection.state;
    const targetId = currentSelectedElement.getId(true);
    this.tableSelection.removeSingleSelection();

    let newColPosition = getSymbolPositionInAlphabet(targetId.col);
    let newRowPosition = Number(targetId.row);

    switch (arrowKeyName) {
      case 'ArrowLeft': {
        newColPosition = Math.max(newColPosition - 1, 1);
        const newColName = getSymbolByPositionInAlphabet(newColPosition);
        this.tableSelection.selectByCoords(newColName, targetId.row);
        break;
      }
      case 'ArrowRight':
      case 'Tab': {
        newColPosition = Math.min(newColPosition + 1, this.englishAlphabetLength);
        const newColName = getSymbolByPositionInAlphabet(newColPosition);
        this.tableSelection.selectByCoords(newColName, targetId.row);
        break;
      }
      case 'ArrowDown':
      case 'Enter': {
        newRowPosition = Math.min(newRowPosition + 1, this.numberOfRows);
        this.tableSelection.selectByCoords(targetId.col, newRowPosition);
        break;
      }
      case 'ArrowUp': {
        newRowPosition = Math.max(newRowPosition - 1, 1);
        this.tableSelection.selectByCoords(targetId.col, newRowPosition);
        break;
      }
      default:
        return null;
    }

    return null;
  }

  moveSelectionByArrowClick(keyName) {
    if (!this.numberOfRows) {
      throw new Error('You need to define \'numberOfRows\' field!');
    }

    const { currentSelectedElement } = this.tableSelection.state;

    if (currentSelectedElement) {
      this.selectElementByArrowKeyName(keyName);
    }
  }
}

export default TableKeyboardControl;
