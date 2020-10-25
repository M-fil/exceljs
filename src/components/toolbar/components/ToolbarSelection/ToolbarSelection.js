import { getPropNameByKey } from '../../helpers/helpers';
import { toolbarButtonKeys } from '../../../../constants/toolbar';

const { TEXT, ALIGN } = toolbarButtonKeys;

class ToolbarSelection {
  constructor(root) {
    this.$root = root;

    this.listenTableCellSelection = this.listenTableCellSelection.bind(this);
  }

  setButtonElements(buttons) {
    this.buttons = buttons;
  }

  listenTableCellSelection(cell) {
    const selector = cell && cell.align;
    const alignButton = this.buttons.align[selector];

    if (cell) {
      if (alignButton) {
        Object.values(this.buttons.align).forEach((button) => {
          button.removeClasses('active');
        });
        alignButton.addClasses('active');
      }

      Object.values(this.buttons.text).forEach((button) => {
        const toolbarButtonType = button.dataAttr.toolbarButton;
        if (cell[getPropNameByKey(toolbarButtonType)]) {
          button.addClasses('active');
        } else {
          button.removeClasses('active');
        }
      });
    } else {
      this.$root.findAll('[data-toolbar-button]').forEach((button) => {
        button.removeClasses('active');
      });
      this.buttons.align.left.addClasses('active');
    }
  }

  getStateChanges(targetCell, buttonType) {
    this.changes = {};
    this.textProp = '';

    switch (buttonType) {
      case ALIGN.LEFT:
        this.changes = { align: ALIGN.LEFT };
        break;
      case ALIGN.RIGHT:
        this.changes = { align: ALIGN.RIGHT };
        break;
      case ALIGN.CENTER:
        this.changes = { align: ALIGN.CENTER };
        break;
      case TEXT.BOLD:
        this.changes = { isBold: !(targetCell.isBold) };
        this.textProp = 'isBold';
        break;
      case TEXT.ITALIC:
        this.changes = { isItalic: !(targetCell.isItalic) };
        this.textProp = 'isItalic';
        break;
      case TEXT.UNDERLINED:
        this.changes = { isUnderlined: !(targetCell.isUnderlined) };
        this.textProp = 'isUnderlined';
        break;
      default:
        this.changes = { align: ALIGN.LEFT };
    }

    return {
      changes: this.changes,
      textProp: this.textProp,
    };
  }

  addSelectionClasses(groupType, buttonType, targetCell, target) {
    if (groupType === 'align' && targetCell.align !== buttonType) {
      const selector = targetCell && targetCell.align;
      const previousSelectedAlign = this.$root.findOne(`[data-toolbar-button="${selector}"]`);
      previousSelectedAlign.removeClasses('active');
      target.addClasses('active');
    } else if (this.changes[this.textProp]) {
      target.addClasses('active');
    }
  }

  selectToolbarButtons(target, targetCell) {
    if (target.isElement()) {
      const buttonType = target.dataAttr.toolbarButton;
      const groupType = target.dataAttr.toolbarGroup;

      if (targetCell) {
        this.getStateChanges(targetCell, buttonType);
        this.addSelectionClasses(
          groupType, buttonType, targetCell, target,
        );
      }
    }

    return this.changes;
  }
}

export default ToolbarSelection;
