/**
 * All the different types of channels
 * * `GUILD_TEXT` - A text channel on Discord
 * * `UNKNOWN` - An unknown channel type
 * @typedef {string} ChannelType
 */
type ChannelType = 'GUILD_TEXT' | 'UNKNOWN';

const RawChannelTypes: Record<number, ChannelType> = {
	0: 'GUILD_TEXT',
};

export { ChannelType, RawChannelTypes };