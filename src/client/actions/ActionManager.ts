import type { Client } from '../Client.js';

type Handler = (client: Client, ...data: never[]) => void;
interface Action {
  handle: Handler;
}

/** @private */
class ActionManager {
  loaded: { [key: string]: Action } = {};
  constructor() {
    this.loaded = {};
    this.loadActions();
  }

  async loadActions() {
    this.loaded.READY = await import('./READY');
  }
}

export { ActionManager };
