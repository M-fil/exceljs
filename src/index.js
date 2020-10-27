import './scss/index.scss';
import 'material-icons/iconfont/material-icons.scss';

import DashboardPage from './pages/DashboardPage';
import ExcelPage from './pages/ExcelPage';
import Router from './core/routes/Router';

const root = document.querySelector('#root');
new Router(root, {
  dashboard: DashboardPage,
  excel: ExcelPage,
}).init();
