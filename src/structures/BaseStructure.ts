import type { Client } from '../client/Client';

class BaseStructure {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }

  parseData(_param: any) {
    return _param;
  }
}

export { BaseStructure };
