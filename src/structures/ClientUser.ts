import User from './User';
import type Client from '../client/Client';

class ClientUser extends User {
    constructor(client: Client, data: object) {
        super(client, data);
        this.client = client;
        this.parseData(data);
    }

    override parseData(data: any): any {
        if (!data) return null;
        return data;
    }
}

export default ClientUser;
