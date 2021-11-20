import DataManager from './DataManager';

import type Client from '../client/Client';

class User extends DataManager {
    // User properties
    id!: string;

    constructor(client: Client, data: Record<string, any>) {
        super(client);
        this.parseData(data);
    }

    override parseData(data: Record<string, any>): any {
        if (!data) return null;

        this.id = data.id;
        return data;
    }
}

export default User;
