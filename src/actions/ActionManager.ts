class ActionManager {
	loaded: { [key: string]: any } = {};
	constructor() {
		this.loaded = {};
		this.loadActions();
	}

	async loadActions() {
		this.loaded['READY'] = await import('./READY.js');
		this.loaded['GUILD_CREATE'] = await import('./GUILD_CREATE.js');
		this.loaded['GUILD_DELETE'] = await import('./GUILD_DELETE.js');
	}
}

export default ActionManager;