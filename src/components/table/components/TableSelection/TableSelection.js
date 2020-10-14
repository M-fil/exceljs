class TableSelection {
  constructor() {
    this.state = {
      currentSelectedElement: null,
      selectedElements: [],
    };
  }

  select(targetElement, withClassRemove = true) {
    if (this.state.currentSelectedElement && withClassRemove) {
      this.state.currentSelectedElement.removeClasses('selected');
    }

    if (targetElement) {
      this.state.currentSelectedElement = targetElement;
      const { currentSelectedElement } = this.state;
      if (currentSelectedElement) {
        currentSelectedElement.addClasses('selected');
      }
    }
  }

  selectGroup(targetElement) {
    const isAlreadySelected = this.state.selectedElements
      ?.some((element) => element.isHTMLLinkEquals(targetElement));

    if (!isAlreadySelected && this.state.selectedElements) {
      this.state.selectedElements.push(targetElement);
      this.state.selectedElements
        .slice(1)
        .filter((element) => element && !element.hasClass('group-selected'))
        .forEach((element) => {
          element.addClasses('group-selected');
        });
    }
  }

  removeSelectionGroup() {
    this.state.selectedElements.forEach((element) => {
      element.removeClasses('group-selected');
    });
    this.state.selectedElements = [];
  }
}

export default TableSelection;
