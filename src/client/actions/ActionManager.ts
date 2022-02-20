import type { GatewayDispatchEvents, GatewayReceivePayload } from 'discord-api-types/v10';
import type { Client } from '../Client.js';

export type Handler = (client: Client, data: GatewayReceivePayload['d']) => void;
export interface Action {
  handle: Handler;
}

/**
 * The ActionManager is responsible for handling all events that are dispatched by the Gateway
 * @private
 */
class ActionManager {
  loaded: Partial<Record<GatewayDispatchEvents, Action>> = {};
  constructor() {
    this.loaded = {};
    this.loadActions();
  }

  /**
   * Loads all actions from the actions folder
   * @private
   */
  async loadActions() {
    this.loaded.READY = await import('./READY');
  }
}

export { ActionManager };
