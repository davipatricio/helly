import type { Client } from '../client/Client';

class DataManager {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	_clone() {
		return Object.assign(Object.create(this), this);
	}

	// eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars
	parseData(..._param: any) {}
}

export { DataManager };
