import type Client from '../client/Client';
import type Guild from './Guild';
import type { ChannelType } from './GuildChannel';

type AllowedMentionsType = 'users' | 'roles' | 'everyone';

export interface AllowedMentionsOptions {
    parse?: Array<AllowedMentionsType>,
    users?: Array<string>,
    roles?: Array<string>,
    repliedUser?: boolean,
}

class TextChannel {
    client: Client;

    // Channel properties
    guildId!: string | null;
    name!: string | null;
    type!: ChannelType;
    id!: string | null;
    nsfw!: boolean;
    topic!: string | null;
    rateLimitPerUser!: number;

    constructor(client: Client, data: object, guild: Guild) {
        this.client = client;
        this.parseData(data, guild);
    }

    get guild(): Guild | null {
        return null;
    }

    toString(): string {
        return `<#${this.id}>`;
    }

    parseData(data: any, guild: Guild): any {
        if (!data) return null;

        this.name = data.name;
        this.type = 'GUILD_TEXT';
        this.nsfw = data.nsfw ?? false;
        this.topic = data.topic ?? null;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;

        this.id = data.id;
        this.guildId = guild?.id;
        return data;
    }
}

export default TextChannel;
