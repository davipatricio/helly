import type Client from '../client/Client';
import GuildChannel from './GuildChannel';

type AllowedMentionsType = 'users' | 'roles' | 'everyone';

export interface AllowedMentionsOptions {
    parse?: Array<AllowedMentionsType>,
    users?: Array<string>,
    roles?: Array<string>,
    repliedUser?: boolean,
}

class TextChannel extends GuildChannel {
    client: Client;
    guild: object;
    constructor(client: Client, data: object, guild: object) {
        super();
        this.client = client;
        this.guild = guild;

        this.parseData(data);
    }

    parseData(data: any) {
        this.name = data.name;
        return data;
    }
}

export default TextChannel;
