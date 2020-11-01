import create from '@core/create';
import { storage } from '@core/utils';

class TableRecords {
  static getTableHref(tableId) {
    return `#excel/${tableId}`;
  }

  static generateNewTableLink() {
    const tableId = Date.now();
    return `#excel/${tableId}`;
  }

  static createRecordElement(tableName, tableId, date) {
    const tableHref = TableRecords.getTableHref(tableId);
    const li = create('li', 'db__record');
    create('a', '', tableName, li, ['href', tableHref]);
    create('strong', '', date && new Date(date).toDateString(), li);

    return li;
  }

  constructor(tableId, tableCreateDate) {
    this.tableId = tableId;
    this.tableCreateDate = tableCreateDate;

    this.store = storage('excel-state') || {};
  }

  getListOfRecords() {
    return this.store && Object.keys(this.store).map((key) => {
      const tableState = this.store[key];

      return {
        id: key,
        tableName: tableState.tableName,
        date: tableState.date,
      };
    });
  }

  renderListHeader() {
    this.dbTable = create('div', 'db__table db__view');
    create('div', 'db__list-header', [
      create('span', '', 'Name'),
      create('span', '', 'Creation Date'),
    ], this.dbTable);

    return this.dbTable;
  }

  renderRecords(container) {
    const records = this.getListOfRecords();
    if (!records.length) {
      const messageElement = create('strong', '', 'No any tables were created yet...');
      container.append(messageElement);
    } else {
      this.dbTable = this.renderListHeader();
      records.forEach((record) => {
        const recordElement = TableRecords
          .createRecordElement(
            record.tableName, record.id, record.date,
          );
        this.dbTable.append(recordElement);
      });
      container.append(this.dbTable);
    }
  }
}

export default TableRecords;