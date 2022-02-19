import type { GatewayDispatchEvents, GatewayReceivePayload } from 'discord-api-types/v10';
import type { Client } from '../Client.js';

export type Handler = (client: Client, ...data: GatewayReceivePayload['d'][]) => void;
export interface Action {
  handle: Handler;
}

/** @private */
class ActionManager {
  loaded: Partial<Record<GatewayDispatchEvents, Action>> = {};
  constructor() {
    this.loaded = {};
    this.loadActions();
  }

  async loadActions() {
    this.loaded.READY = await import('./READY');
  }
}

export { ActionManager };
