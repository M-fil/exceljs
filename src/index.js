import './scss/index.scss';
import 'material-icons/iconfont/material-icons.scss';

import DashboardPage from './pages/DashboardPage';
import ExcelPage from './pages/ExcelPage';
import ErrorPage from './pages/ErrorPage';

import Router from './core/routes/Router';

const root = document.querySelector('#root');
new Router(root, {
  dashboard: DashboardPage,
  excel: ExcelPage,
  error: ErrorPage,
}).init();
