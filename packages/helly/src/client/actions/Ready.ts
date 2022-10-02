import { GatewayIntentBits } from 'discord-api-types/v10';
import type { Client } from '../Client';

function handle(client: Client /* data: GatewayReadyDispatch */) {
  if (!client.ready) {
    setTimeout(
      () => {
        client.ready = true;
        client.emit('Ready');
      },
      // If the client has the GUILDS intent, wait X seconds before emitting ready otherwise emit it immediately
      client.options.intents.has(GatewayIntentBits.Guilds) ? client.options.waitGuildTimeout : 0,
    );
  }
}

export default { handle };
