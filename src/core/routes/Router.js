import ActiveRoute from './ActiveRoute';

class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('You should provide a main selector to render the page');
    }

    this.selector = selector;
    this.routes = routes;

    this.changePageHandler = this.changePageHandler.bind(this);
  }

  changePageHandler() {
    const Page = this.routes.excel;
    const page = new Page();
    this.selector.append(page.getRoot());
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}

export default Router;
