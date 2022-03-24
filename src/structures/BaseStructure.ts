import type { Client } from '../client/Client';

class BaseStructure {
  /** The client that instantiated this structure */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }
}

export { BaseStructure };
