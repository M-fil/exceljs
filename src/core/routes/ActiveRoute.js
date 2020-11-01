class ActiveRoute {
  // eslint-disable-next-line class-methods-use-this
  get hash() {
    return window.location.hash.replace('#', '');
  }

  get origin() {
    return window.location.origin;
  }

  getParams(hash) {
    return hash ? hash.split('/') : {};
  }

  getId(hash) {
    return this.getParams(hash)[1];
  }

  navigate(newURL) {
    window.location.replace(newURL);
  } 
}

export default ActiveRoute;
