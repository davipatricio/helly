import type { Client } from '../Client';

type Handler = (client: Client, ...data: unknown[]) => void;
interface Action {
  handle: Handler;
}

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
