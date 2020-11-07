import AbstractClient from './AbstractClient';
import { storage } from '@core/utils';

class LocalStorageClient extends AbstractClient {
  constructor(name) {
    super();

    this.name = name;
  }

  save(state) {
    storage(this.name, {
      ...(storageData || {}),
      [this.tableId]: state,
    });
  }

  get() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(storage(this.name))
      }, 1000);
    });
  }
}

export default LocalStorageClient;