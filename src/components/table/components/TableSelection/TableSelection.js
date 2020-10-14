class TableSelection {
  constructor() {
    this.state = {
      currentSelectedElement: null,
    };
  }

  select(targetElement) {
    if (this.state.currentSelectedElement) {
      this.state.currentSelectedElement.classList.remove('selected');
    }

    this.state.currentSelectedElement = targetElement;
    const { currentSelectedElement } = this.state;
    if (currentSelectedElement) {
      currentSelectedElement.classList.add('selected');
    }
  }

  selectGroup() {}
}

export default TableSelection;
