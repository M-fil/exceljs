class ActiveRoute {
  // eslint-disable-next-line class-methods-use-this
  get hash() {
    return window.location.hash.replace('#', '');
  }

  get params() {
    return ActiveRoute.hash.split('/');
  }
}

export default ActiveRoute;
