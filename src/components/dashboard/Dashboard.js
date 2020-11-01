import create from '@core/create';
import TableRecords from './components/TableRecords';

class Dashboard {
  constructor() {
    this.root = create('div', 'db');
    this.records = new TableRecords();
  }

  render() {
    const header = create('div', 'db__header');
    create('h1', '', 'Excel Dashboard', header);

    const newTableLink = TableRecords.generateNewTableLink();
    const dbNewElement = create('div', 'db__new');
    const dbView = create('div', 'db__view', '', dbNewElement);
    create('a', 'db__create', 'New <br /> Table', dbView, ['href', newTableLink]);

    this.root.append(header, dbNewElement);
    this.records.renderRecords(this.root);

    return this.root;
  }
}

export default Dashboard;
