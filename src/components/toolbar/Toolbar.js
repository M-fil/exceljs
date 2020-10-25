import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import { $ } from '@core/dom';

import { saveTableCellData } from '../../redux/actions';
import { toolbarButtonKeys } from '../../constants/toolbar';
import {
  getTextAlignByKey,
  getPropNameByKey,
} from './helpers/helpers';
import ToolbarSelection from './components/ToolbarSelection/ToolbarSelection';

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
    this.selection = new ToolbarSelection(this.$root);
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
    this.$on('table:cell-selection', this.selection.listenTableCellSelection);
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
    this.selection.setButtonElements(this.toolbarButtons);
  }

  onClick(event) {
    const target = $(event.target).closest('[data-toolbar-button]');
    const { cells, targetCellId } = this.$getState();
    const targetCell = cells[targetCellId];

    const changes = this.selection.selectToolbarButtons(target, targetCell);
    this.$emit('toolbar:button-click', changes, targetCell);
    this.$dispatch(saveTableCellData(targetCellId, changes));
  }
}

export default Toolbar;
