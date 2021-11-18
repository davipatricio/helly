import type Client from '../client/Client';

class GuildChannel {
    client: Client;
    // Channel properties
    name: string | null;
    type: ChannelType;
    id!: string | null;
    constructor(client: Client) {
        this.client = client;
        this.name = null;
        this.type = 'UNKNOWN';
    }

    toString(): string {
        return `<#${this.id}>`;
    }
}

export default GuildChannel;
export type ChannelType = 'GUILD_TEXT' | 'DM' | 'GUILD_VOICE' | 'GROUP_DM' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE' | 'GUILD_NEWS_THREAD' |'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 'GUILD_STAGE_VOICE' | 'UNKNOWN';
