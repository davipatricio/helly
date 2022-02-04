/**
 * All the different channel types:
 * * `PING`
 * * `APPLICATION_COMMAND`
 * * `MESSAGE_COMPONENT`
 * * `APPLICATION_COMMAND_AUTOCOMPLETE`
 * @typedef {string} InteractionType
 */
type InteractionType = 'PING' | 'APPLICATION_COMMAND' | 'MESSAGE_COMPONENT' | 'APPLICATION_COMMAND_AUTOCOMPLETE';

const RawInteractionTypes: Record<number, InteractionType> = {
	1: 'PING',
	2: 'APPLICATION_COMMAND',
	3: 'MESSAGE_COMPONENT',
	4: 'APPLICATION_COMMAND_AUTOCOMPLETE',
};

/**
 * All the different channel types:
 * * `CHAT_INPUT`
 * * `USER`
 * * `MESSAGE`
 * @typedef {string} CommandType
 */
type CommandType = 'CHAT_INPUT' | 'USER' | 'MESSAGE';

const RawCommandTypes: Record<number, CommandType> = {
	1: 'CHAT_INPUT',
	2: 'USER',
	3: 'MESSAGE',
};

export { InteractionType, RawInteractionTypes, RawCommandTypes, CommandType };