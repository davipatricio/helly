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
	}
}

export { ActionManager };