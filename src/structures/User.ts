import type Client from '../client/Client';

class User {
    client: Client;

    // User properties
    id!: string;

    constructor(client: Client, data: object) {
        this.client = client;
        this.parseData(data);
    }

    parseData(data: any): any {
        if (!data) return null;

        this.id = data.id;
        return data;
    }
}

export default User;
