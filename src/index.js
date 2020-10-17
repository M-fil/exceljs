import './scss/index.scss';
import 'material-icons/iconfont/material-icons.scss';

import { createStore } from '@core/createStore';
import { rootReducer } from './redux/rootReducer';

import Excel from './components/excel/Excel';
import Table from './components/table/Table';
import Toolbar from './components/toolbar/Toolbar';
import Formula from './components/formula/Formula';
import Header from './components/header/Header';

const store = createStore(rootReducer, {
  tableState: {
    cols: {},
    rows: {},
  },
});

const excel = new Excel('.root', {
  components: [Table, Header, Formula, Toolbar],
  store,
});

excel.render();
