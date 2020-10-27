import Page from '@core/Page';
import Dashboard from '../components/dashboard/Dashboard';

class DashboardPage extends Page {
  constructor() {
    super();
    this.dashboard = new Dashboard();
  }

  getRoot() {
    return this.dashboard.render();
  }
}

export default DashboardPage;
