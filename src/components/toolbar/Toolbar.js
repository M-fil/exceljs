import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import { $ } from '@core/dom';

import { saveTableCellData } from '../../redux/actions';
import { toolbarButtonKeys } from '../../constants/toolbar';
import {
  getTextAlignByKey,
  getPropNameByKey,
  getKeyByTextAlign,
} from './helpers/helpers';

const { TEXT, ALIGN } = toolbarButtonKeys;

class Toolbar extends ExcelComponent {
  static getClassName() {
    return 'excel__toolbar';
  }

  constructor($root, options) {
    super($root, {
      name: 'Toolbar',
      listeners: ['click'],
      subscribe: ['cells'],
      ...options,
    });

    this.onClick = this.onClick.bind(this);
  }

  createButtonElement(iconName, toolbarButtonType = '', toolbarGroupType = '') {
    const { cells, targetCellId } = this.$getState();
    const targetCell = cells[targetCellId] || {};

    const icon = create('i', 'material-icons', iconName);
    const button = $(create(
      'div', 'button',
      icon, null,
      ['toolbarButton', toolbarButtonType, true],
      ['toolbarGroup', toolbarGroupType, true],
    ));
    if (targetCell[getPropNameByKey(toolbarButtonType)] && !toolbarGroupType) {
      button.addClasses('active');
    }

    if (getTextAlignByKey(toolbarButtonType) === targetCell.align) {
      button.addClasses('active');
    }

    return button;
  }

  init() {
    super.init();
    this.$on('table:cell-selection', (cell) => {
      const selector = cell && cell.align;
      const alignButton = this.toolbarButtons.align[selector];

      if (cell) {
        if (alignButton) {
          Object.values(this.toolbarButtons.align).forEach((button) => {
            button.removeClasses('active');
          });
          alignButton.addClasses('active');
        } else {
          Object.values(this.toolbarButtons.align).forEach((button) => {
            button.removeClasses('active');
          });
        }

        Object.values(this.toolbarButtons.text).forEach((button) => {
          const toolbarButtonType = button.dataAttr.toolbarButton;
          if (cell[getPropNameByKey(toolbarButtonType)]) {
            button.addClasses('active');
          } else {
            button.removeClasses('active');
          }
        });
      }
    });
  }

  toHTML() {
    this.$root.append(this.createButtonElement('format_align_left', ALIGN.LEFT, 'align'));
    this.$root.append(this.createButtonElement('format_align_center', ALIGN.CENTER, 'align'));
    this.$root.append(this.createButtonElement('format_align_right', ALIGN.RIGHT, 'align'));
    this.$root.append(this.createButtonElement('format_bold', TEXT.BOLD));
    this.$root.append(this.createButtonElement('format_italic', TEXT.ITALIC));
    this.$root.append(this.createButtonElement('format_underlined', TEXT.UNDERLINED));

    this.toolbarButtons = {
      align: {
        left: this.$root.findOne(`[data-toolbar-button="${ALIGN.LEFT}"]`),
        right: this.$root.findOne(`[data-toolbar-button="${ALIGN.RIGHT}"]`),
        center: this.$root.findOne(`[data-toolbar-button="${ALIGN.CENTER}"]`),
      },
      text: {
        bold: this.$root.findOne(`[data-toolbar-button="${TEXT.BOLD}"]`),
        italic: this.$root.findOne(`[data-toolbar-button="${TEXT.ITALIC}"]`),
        underlined: this.$root.findOne(`[data-toolbar-button="${TEXT.UNDERLINED}"]`),
      },
    };
  }

  onClick(event) {
    const target = $(event.target).closest('[data-toolbar-button]');
    let changes = {};

    if (target.isElement()) {
      const { cells, targetCellId } = this.$getState();
      const targetCell = cells[targetCellId];

      const buttonType = target.dataAttr.toolbarButton;
      const groupType = target.dataAttr.toolbarGroup;
      let textProp = '';

      switch (buttonType) {
        case ALIGN.LEFT:
          changes = { align: getTextAlignByKey(ALIGN.LEFT) };
          break;
        case ALIGN.RIGHT:
          changes = { align: getTextAlignByKey(ALIGN.RIGHT) };
          break;
        case ALIGN.CENTER:
          changes = { align: getTextAlignByKey(ALIGN.CENTER) };
          break;
        case TEXT.BOLD:
          changes = { isBold: !(targetCell.isBold) };
          textProp = 'isBold';
          break;
        case TEXT.ITALIC:
          changes = { isItalic: !(targetCell.isItalic) };
          textProp = 'isItalic';
          break;
        case TEXT.UNDERLINED:
          changes = { isUnderlined: !(targetCell.isUnderlined) };
          textProp = 'isUnderlined';
          break;
        default:
          changes = {};
      }

      if (groupType === 'align') {
        if (targetCell.align === getTextAlignByKey(buttonType)) {
          target.removeClasses('active');
          changes = { align: 'initial' };
        } else {
          target.addClasses('active');
          const selector = targetCell && getKeyByTextAlign(targetCell.align);
          const previousSelectedAlign = this.$root
            .findOne(`[data-toolbar-button="${selector}"]`);
          previousSelectedAlign.removeClasses('active');
        }
      } else if (changes[textProp]) {
        target.addClasses('active');
      } else {
        target.removeClasses('active');
      }

      console.log('changes', changes);
      this.$emit('toolbar:button-click', changes, targetCell);
      this.$dispatch(saveTableCellData(targetCellId, changes));
    }
  }
}

export default Toolbar;
