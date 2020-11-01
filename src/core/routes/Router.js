import ActiveRoute from './ActiveRoute';

const AVAILABLE_PATHS = {
  EXCEL: 'excel',
  DASHBOARD: 'dashboard',
};

class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('You should provide a main selector to render the page');
    }

    this.selector = selector;
    this.routes = routes;
    this.activeRoute = new ActiveRoute();
    this.page = null;

    this.changePageHandler = this.changePageHandler.bind(this);
  }

  clearRootContent() {
    this.selector.innerHTML = '';
  }

  changePageHandler() {
    if (this.page) {
      this.page.destroy();
    }
    this.clearRootContent();
    const { hash } = this.activeRoute;
    let pageKey = '';

    switch (hash) {
      case AVAILABLE_PATHS.EXCEL:
        pageKey = 'excel';
        break;
      case AVAILABLE_PATHS.DASHBOARD:
        pageKey = 'dashboard';
        break;
      default:
        pageKey = 'error';
    }

    let Page = this.routes[pageKey];
    if (!hash || hash === '/') {
      Page = this.routes.dashboard;
    }
    if (hash.includes('excel')) {
      Page = this.routes.excel;
    }

    const tableId = this.activeRoute.getParams(hash)[1] || Date.now();
    this.page = new Page(tableId);
    this.selector.append(this.page.getRoot());

    this.page.afterRender();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  destroy() {
    this.clearRootContent();
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}

export default Router;
