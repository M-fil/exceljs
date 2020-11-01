import Page from '@core/Page';
import Dashboard from '../components/dashboard/Dashboard';

class DashboardPage extends Page {
  constructor(tableId) {
    super();
    this.dashboard = new Dashboard(tableId);
  }

  getRoot() {
    return this.dashboard.render();
  }
}

export default DashboardPage;
