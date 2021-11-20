import type Client from '../client/Client';

class DataManager {
    client: Client;
    constructor(client: Client) {
      this.client = client;
    }

    _clone() {
      return Object.assign(Object.create(this), this);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, no-empty-function
    parseData(..._param: any) {}

    _update(data: any, ...params: any) {
      const clone = this._clone();
      this.parseData(data, params);
      return clone;
    }
  }

export default DataManager;
