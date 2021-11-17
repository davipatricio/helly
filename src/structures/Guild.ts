import type Client from '../client/Client';

class Guild {
    name: string | null;
    client: Client;
    constructor(client: Client, data: object) {
        this.client = client;
        this.name = null;

        this.parseData(data);
    }

    parseData(data: any) {
        this.name = data.name;
        return data;
    }
}

export default Guild;
