/**
 * All the different channel types:
 * * `GUILD_TEXT` - A text channel on Discord
 * * `DM` - A DM channel
 * * `UNKNOWN` - An unknown channel type
 * @typedef {string} ChannelType
 */
type ChannelType = 'GUILD_TEXT' | 'DM' | 'UNKNOWN';

const RawChannelTypes: Record<number, ChannelType> = {
	0: 'GUILD_TEXT',
	1: 'DM',
};

export { ChannelType, RawChannelTypes };