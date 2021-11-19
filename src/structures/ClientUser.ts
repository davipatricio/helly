import User from './User';
import type Client from '../client/Client';

class ClientUser extends User {
    constructor(client: Client, data: object) {
        super(client, data);
        this.parseData(data);
    }

    override parseData(data: Record<string, any>): any {
        if (!data) return null;
        return data;
    }
}

export default ClientUser;
