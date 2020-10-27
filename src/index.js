import './scss/index.scss';
import 'material-icons/iconfont/material-icons.scss';

import { createStore } from '@core/createStore';
import { storage, debounce } from '@core/utils';
import { rootReducer } from './redux/rootReducer';

import Excel from './components/excel/Excel';
import Table from './components/table/Table';
import Toolbar from './components/toolbar/Toolbar';
import Formula from './components/formula/Formula';
import Header from './components/header/Header';

const storageData = storage('excel-state');
const store = createStore(rootReducer, storageData || {
  targetCellId: '',
  formulaText: '',
  tableName: '',
  cols: {},
  rows: {},
  cells: {},
});

const storeListener = debounce((state) => {
  storage('excel-state', state);
}, 300);
store.subscribe(storeListener);

const excel = new Excel('.root', {
  components: [Formula, Table, Header, Toolbar],
  store,
});

excel.render();
