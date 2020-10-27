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

  changePageHandler(event) {
    console.log(ActiveRoute.path);
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
