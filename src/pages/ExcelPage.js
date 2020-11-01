import Page from '@core/Page';
import { createStore } from '@core/createStore';
import { storage, debounce } from '@core/utils';

import Excel from '../components/excel/Excel';
import Table from '../components/table/Table';
import Toolbar from '../components/toolbar/Toolbar';
import Formula from '../components/formula/Formula';
import Header from '../components/header/Header';

import { rootReducer } from '../redux/rootReducer';

const INITIAL_STATE = {
  targetCellId: '',
  formulaText: '',
  tableName: 'New Table',
  date: null,
  cols: {},
  rows: {},
  cells: {},
};

class ExcelPage extends Page {
  constructor(tableId) {
    super();
    this.tableId = tableId;
    this.excel = null;
  }

  getRoot() {
    const storageData = storage('excel-state');
    const tableState = (storageData && storageData[this.tableId]) || INITIAL_STATE;
    storage('excel-state', {
      ...(storageData || {}),
      [this.tableId]: {
        date: new Date(),
        ...tableState,
      },
    });
    const store = createStore(rootReducer, tableState);

    const storeListener = debounce((state) => {
      storage('excel-state', {
        ...(storageData || {}),
        [this.tableId]: state,
      });
    }, 300);
    store.subscribe(storeListener);
    this.excel = new Excel({
      components: [Formula, Table, Header, Toolbar],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
  }
}

export default ExcelPage;
