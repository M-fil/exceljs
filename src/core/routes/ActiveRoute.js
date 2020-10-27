class ActiveRoute {
  // eslint-disable-next-line class-methods-use-this
  get path() {
    return window.location.hash;
  }

  get params() {
    return ActiveRoute.path.split('/');
  }
}

export default ActiveRoute;
