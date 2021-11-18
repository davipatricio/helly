class GuildChannel {
    name: string;
    type: ChannelType;
    constructor() {
        this.name = '';
        this.type = 'UNKNOWN';
    }
}

export default GuildChannel;
export type ChannelType = 'GUILD_TEXT' | 'DM' | 'GUILD_VOICE' | 'GROUP_DM' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE' | 'GUILD_NEWS_THREAD' |'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 'GUILD_STAGE_VOICE' | 'UNKNOWN';
