import GuildChannel from './GuildChannel';

import type Client from '../client/Client';
import type Guild from './Guild';

type AllowedMentionsType = 'users' | 'roles' | 'everyone';

export interface AllowedMentionsOptions {
    parse?: Array<AllowedMentionsType>,
    users?: Array<string>,
    roles?: Array<string>,
    replied_user?: boolean,
}

class TextChannel extends GuildChannel {
    // Channel properties
    guildId!: string;
    nsfw!: boolean;
    topic!: string | null;
    rateLimitPerUser!: number;

    constructor(client: Client, data: object) {
        super(client);
        this.parseData(data);
    }

    get guild(): Guild | null {
        return this.client.guilds.cache.get(this.guildId) ?? null;
    }

    parseData(data: any): any {
        if (!data) return null;

        this.name = data.name;
        this.type = 'GUILD_TEXT';
        this.nsfw = data.nsfw ?? false;
        this.topic = data.topic ?? null;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;

        this.id = data.id;
        this.guildId = data.guild_id;
        return data;
    }
}

export default TextChannel;
