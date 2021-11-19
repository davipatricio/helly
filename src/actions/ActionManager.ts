import { readdirSync } from 'node:fs';
import type Client from '../client/Client';

class ActionManager {
    loaded: Record<string, any>;
    constructor(client: Client) {
        this.loaded = {};
        const actions = readdirSync(__dirname);

        for (let action of actions) {
            action = action.replace('.js', '');

            // Do not load the file itself
            if (action === 'ActionManager') continue;

            // Do not load disabled events
            if (client.options.disabledEvents!.includes(action)) continue;
            this.loaded[action] = require(`./${action}`);
        }
    }
}

export default ActionManager;
