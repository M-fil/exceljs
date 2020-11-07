import Page from '@core/Page';
import { createStore } from '@core/store/createStore';
import Loader from '../components/loader/Loader';
import StateProcessor from '@core/db/StateProcessor';
import LocalStorageClient from '@core/db/clients/LocalStorageClient';

import Excel from '../components/excel/Excel';
import Table from '../components/table/Table';
import Toolbar from '../components/toolbar/Toolbar';
import Formula from '../components/formula/Formula';
import Header from '../components/header/Header';

import { rootReducer } from '../redux/rootReducer';

class ExcelPage extends Page {
  constructor(tableId) {
    super();
    this.tableId = tableId;
    this.excel = null;

    this.storeSub = null;
    const localStorageClient = new LocalStorageClient('excel-state');
    this.processor = new StateProcessor(localStorageClient);
    this.loader = new Loader();
  }

  async getRoot() {
    this.loader.show();
    const storageData = await this.processor.get();
    const client = this.processor.getClient();
    const tableState = client.saveInitialStorageData(this.tableId, storageData);
    // storage('excel-state', {
    //   ...(storageData || {}),
    //   [this.tableId]: tableState,
    // });
    const store = createStore(rootReducer, tableState);
    this.subStore = store.subscribe(this.processor.listen);
    this.excel = new Excel({
      components: [Formula, Table, Header, Toolbar],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.loader.hide();
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
    if (this.storeSub) {
      this.storeSub.unSubscribe();
    }
  }
}

export default ExcelPage;
