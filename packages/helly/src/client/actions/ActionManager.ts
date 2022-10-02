import type { GatewayDispatchEvents, GatewayDispatchPayload } from 'discord-api-types/v10';
import type { Client } from '../Client';
import Ready from './Ready';

interface BaseAction {
  handle(client: Client, data?: GatewayDispatchPayload);
}

type LoadedActions = { [key in keyof typeof GatewayDispatchEvents]: BaseAction };

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
    // this.client.ws.on('Raw', data => {
    //   const dataString = data.toString();
    //   const message = JSON.parse(dataString) as GatewayReceivePayload;
    // });
  }

  loadActions() {
    this.loaded = {
      Ready: Ready.handle,
    } as unknown as LoadedActions;
  }
}
