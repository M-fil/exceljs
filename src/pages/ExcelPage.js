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
  tableName: '',
  cols: {},
  rows: {},
  cells: {},
};

class ExcelPage extends Page {
  constructor() {
    super();
    this.excel = null;
  }

  getRoot() {
    const storageData = storage('excel-state');
    const store = createStore(rootReducer, storageData || INITIAL_STATE);

    const storeListener = debounce((state) => {
      storage('excel-state', state);
    }, 300);
    store.subscribe(storeListener);
    this.excel = new Excel('.root', {
      components: [Formula, Table, Header, Toolbar],
      store,
    });

    return this.excel.getRoot();
  }
}

export default ExcelPage;
