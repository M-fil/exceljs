import { debounce } from '@core/utils';

class StateProcessor {
  constructor(client, delay = 300) {
    this.client = client;
    this.listen = debounce(this.listen.bind(this), delay);
  }

  getClient() {
    return this.client;
  }

  listen(state) {
    this.client.save(state);
  }

  get() {
    return this.client.get();
  }
}

export default StateProcessor;
