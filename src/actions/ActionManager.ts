class ActionManager {
	loaded: { [key: string]: any } = {};
	constructor() {
		this.loaded = {};
		this.loadActions();
	}

	loadActions() {
		this.loaded['READY'] = require('./READY');
		this.loaded['GUILD_CREATE'] = require('./GUILD_CREATE');
		this.loaded['GUILD_DELETE'] = require('./GUILD_DELETE');
		this.loaded['GUILD_MEMBERS_CHUNK'] = require('./GUILD_MEMBERS_CHUNK');
		this.loaded['MESSAGE_CREATE'] = require('./MESSAGE_CREATE');
	}
}

export { ActionManager };