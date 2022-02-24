import type { GatewayDispatchEvents, GatewayReceivePayload } from 'discord-api-types/v10';
import type { Client } from '../Client.js';

/** Represents the type of the {@link Action.handle} function */
export type ActionHandler = (client: Client, data: GatewayReceivePayload['d']) => void;

/** Represents the structure of an Action */
export interface Action {
  handle: ActionHandler;
}

/**
 * ActionManager is responsible for handling all events that are dispatched by the Gateway
 * @private
 */
class ActionManager {
  /** An object mapped by the {@link GatewayDispatchEvents | Actions} name */
  loaded: Partial<Record<GatewayDispatchEvents, Action>> = {};
  constructor() {
    this.loaded = {};
    this.#loadActions();
  }

  /** Loads all actions from the actions folder */
  async #loadActions() {
    this.loaded.READY = await import('./READY');
    this.loaded.GUILD_CREATE = await import('./GUILD_CREATE');
    this.loaded.GUILD_DELETE = await import('./GUILD_DELETE');
  }
}

export { ActionManager };
