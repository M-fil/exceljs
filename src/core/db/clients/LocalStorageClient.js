import { storage } from '@core/utils';
import { getCurrentDateAndTime } from '@core/utils';

import AbstractClient from './AbstractClient';
import { getInitialState } from '../../../redux/initialState';

class LocalStorageClient extends AbstractClient {
  constructor(name) {
    super();

    this.name = name;
  }

  saveInitialStorageData(tableId, storageData) {
    const date = getCurrentDateAndTime();
    const tableState = storageData
      ? storageData[tableId]
      : getInitialState(date);

    storage(this.name, {
      ...(storageData || {}),
      [tableId]: tableState,
    });

    this.stateData = {
      storageData, tableId,
    }

    return tableState;
  }

  save(state) {
    const { storageData, tableId } = this.stateData;
    storage(this.name, {
      ...(storageData || {}),
      [tableId]: state,
    });
    return Promise.resolve();
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