import ExcelComponent from '@core/ExcelComponent';
import create from '../../core/create';

class Toolbar extends ExcelComponent {
  static getClassName() {
    return 'excel__toolbar';
  }

  constructor($root) {
    super($root, {
      name: 'Toolbar',
      listeners: [],
    });
  }

  static createButtonElement(iconName) {
    const icon = create('i', 'material-icons', iconName);
    return create('div', 'button', icon);
  }

  toHTML() {
    this.$root.append(Toolbar.createButtonElement('format_align_left'));
    this.$root.append(Toolbar.createButtonElement('format_align_center'));
    this.$root.append(Toolbar.createButtonElement('format_align_right'));
    this.$root.append(Toolbar.createButtonElement('format_bold'));
    this.$root.append(Toolbar.createButtonElement('format_italic'));
    this.$root.append(Toolbar.createButtonElement('format_underlined'));
  }
}

export default Toolbar;
