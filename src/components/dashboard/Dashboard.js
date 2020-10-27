import create from '@core/create';

class Dashboard {
  constructor() {
    this.root = create('div', 'db');
  }

  render() {
    const header = create('div', 'db__header');
    create('h1', '', 'Excel Dashboard', header);

    const dbNewElement = create('div', 'db__new');
    const dbView = create('div', 'db__view', '', dbNewElement);
    create('a', 'db__create', 'Новая <br /> Таблица', dbView);

    const dbTable = create('div', 'db__table db__view');
    create('div', 'db__list-header', [
      create('span', '', 'Название'),
      create('span', '', 'Дата открытия'),
    ], dbTable);
    create('ul', 'db__list', '', dbTable);

    this.root.append(header, dbNewElement, dbTable);

    return this.root;
  }
}

export default Dashboard;
