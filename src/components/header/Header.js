import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import { $ } from '@core/dom';

import { changeTableName } from '../../redux/actions';

class Header extends ExcelComponent {
  static getClassName() {
    return 'excel__header';
  }

  static isNeedToChangeName(target) {
    return target.isElement() && (target.dataAttr.tableName || target.dataAttr.tableName === '');
  }

  static getDefaultTableName() {
    return 'New Table';
  }

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['change'],
      subscribe: ['tableName'],
      ...options,
    });

    this.onChange = this.onChange.bind(this);
  }

  toHTML() {
    const state = this.$getState();
    const input = create(
      'input', 'input',
      '', null,
      ['type', 'text'], ['value', state.tableName], ['tableName', '', true],
    );
    const divContainer = document.createElement('div');
    create('div', 'button', create('i', 'material-icons', 'delete'), divContainer);
    create('div', 'button', create('i', 'material-icons', 'exit_to_app'), divContainer);
    this.$root.append(input);
    this.$root.append(divContainer);
  }

  onChange(event) {
    const target = $(event.target);
    if (Header.isNeedToChangeName(target)) {
      const tableName = target.content;

      if (tableName.trim() === '') {
        const defaultTableName = Header.getDefaultTableName();
        alert('The table name shouldn\'t be empty!');
        this.$dispatch(changeTableName(defaultTableName));
        target.text(defaultTableName);
      } else {
        this.$dispatch(changeTableName(tableName));
      }
    }
  }
}

export default Header;
