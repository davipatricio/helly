import type { GatewayDispatchEvents, GatewayDispatchPayload } from 'discord-api-types/v10';
import type { Client } from '../Client';
import READY from './READY';

interface BaseAction {
  handle(client: Client, data?: GatewayDispatchPayload): void;
  handle(client: Client): void;
}

type LoadedActions = { [key in typeof GatewayDispatchEvents[keyof typeof GatewayDispatchEvents]]: BaseAction };

/**
 * @private @internal
 */
export class ActionManager {
  /**
   * The client this manager belongs to
   */
  client: Client;
  /**
   * An object containing all the actions
   */
  loaded: LoadedActions;
  constructor(client: Client) {
    this.client = client;
    this.loadActions();
    this.handleActions();
  }

  handleActions() {
    this.client.ws.on('Message', data => {
      if (data.t) this.loaded[data.t]?.handle(this.client, data);
    });
  }

  loadActions() {
    this.loaded = {
      READY,
    } as LoadedActions;
  }
}
