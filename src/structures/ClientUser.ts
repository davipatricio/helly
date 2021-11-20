import User from './User';
import type Client from '../client/Client';

class ClientUser extends User {
    constructor(client: Client, data: Record<string, any>) {
        super(client, data);
        this.parseData(data);
    }
}

export default ClientUser;
