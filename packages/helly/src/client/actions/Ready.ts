import { GatewayIntentBits } from 'discord-api-types/v10';
import { IntentsBitField } from '../../utils';
import type { Client } from '../Client';

export function handle(client: Client /* data: GatewayReadyDispatch */) {
  const baseIntents = new IntentsBitField(client.options.intents);
  if (!client.ready) {
    setTimeout(
      () => {
        client.ready = true;
        client.emit('Ready');
      },
      // If the client has the GUILDS intent, wait X seconds before emitting ready otherwise emit it immediately
      baseIntents.has(GatewayIntentBits.Guilds) ? client.options.waitGuildTimeout : 0,
    );
  }
}
