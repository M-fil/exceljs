import ExcelComponent from '@core/ExcelComponent';
import create from '@core/create';
import { $ } from '@core/dom';
import { storage } from '@core/utils';
import ActiveRoute from '@core/routes/ActiveRoute';

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
      listeners: ['change', 'click'],
      subscribe: ['tableName'],
      ...options,
    });
    this.activeRoute = new ActiveRoute();

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);

    const { hash } = this.activeRoute;
    this.tableId = this.activeRoute.getId(hash);
  }

  toHTML() {
    const state = this.$getState();
    const input = create(
      'input', 'input',
      '', null,
      ['type', 'text'], ['value', state.tableName], ['tableName', '', true],
    );
    const divContainer = document.createElement('div');
    create(
      'div', 'button',
      create('i', 'material-icons', 'delete'),
      divContainer,
      ['deleteTable', '', true],
    );
    create(
      'div', 'button',
      create('i', 'material-icons', 'exit_to_app'),
      divContainer,
      ['toDashboard', '', true],
    );
    this.$root.append(input);
    this.$root.append(divContainer);
  }

  onClick(event) {
    const target = $(event.target);

    if (target.closest('[data-to-dashboard]').isElement()) {
      const { origin } = this.activeRoute;
      const newURL = `${origin}/#dashboard`;
      this.activeRoute.navigate(newURL);
    } else if (target.closest('[data-delete-table]').isElement()) {
      const isConfirmed = confirm('Do you really want to delete this table?');
      if (isConfirmed) {
        const { origin } = this.activeRoute;
        const newURL = `${origin}/#dashboard`;

        this.storage = storage('excel-state');
        delete this.storage[this.tableId];
        storage('excel-state', this.storage);

        this.activeRoute.navigate(newURL);
      }
    }
  }

  onChange(event) {
    const target = $(event.target);
    if (Header.isNeedToChangeName(target)) {
      const tableName = target.content;

      if (tableName.trim() === '') {
        const defaultTableName = Header.getDefaultTableName();
        // eslint-disable-next-line no-alert
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
