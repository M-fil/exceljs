import '@testing-library/jest-dom'
import Router from './Router';
import Page from '../Page';

class DashboardPage extends Page {
  getRoot() {
    const root = document.createElement('div');
    root.className = 'root';
    root.textContent = 'Dashboard';

    return root;
  }
}
class ExcelPage extends Page {}

describe('Router:', () => {
  let router = null;
  let selector = null;

  beforeEach(() => {
    selector = document.createElement('div');
    router = new Router(selector, {
      dashboard: DashboardPage,
      excel: ExcelPage,
    });
  });

  test('Router should be defined', () => {
    expect(router).toBeDefined();
  });

  test('Should render Dashboard page', () => {
    expect(router.routes.dashboard).toBeDefined();
    router.changePageHandler();
    console.log('selector', selector.innerHTML)
    expect(selector.textContent).toBe('Dashboard');
  });
});