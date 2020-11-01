class ActiveRoute {
  // eslint-disable-next-line class-methods-use-this
  get hash() {
    return window.location.hash.replace('#', '');
  }

  getParams(hash) {
    return hash ? hash.split('/') : {};
  }
}

export default ActiveRoute;
