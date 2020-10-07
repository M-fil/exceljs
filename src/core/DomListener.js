class DomListener {
  constructor($root) {
    if (!$root) {
      throw new Error('No root was provided for DomListener class!');
    }

    this.$root = $root;
  }
}

export default DomListener;
