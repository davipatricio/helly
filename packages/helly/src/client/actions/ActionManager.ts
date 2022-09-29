import type { GatewayDispatchEvents } from 'discord-api-types/v10';
import { readdir } from 'fs/promises';
import type { Client } from '../Client';

interface BaseAction {
  handle(client: Client, data?: unknown);
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
    this.loaded = {} as LoadedActions;
    this.loadActions();
  }

  async loadActions() {
    const actions = (await readdir(__dirname)) as (keyof typeof GatewayDispatchEvents)[];
    for (const action of actions) {
      if (action.includes('ActionManager')) continue;
      // eslint-disable-next-line no-await-in-loop
      const { default: Action } = await import(`./${action}`);
      const actionName = action.split('.')[0];
      this.loaded[actionName] = new Action(this.client);
    }
  }
}
