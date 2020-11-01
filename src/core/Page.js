class Page {
  constructor(params) {
    this.params = params;
  }

  getRoot() {
    throw new Error('Method getRoot should be emplemented');
  }
  
  afterRender() {}

  destroy() {}
}

export default Page;
