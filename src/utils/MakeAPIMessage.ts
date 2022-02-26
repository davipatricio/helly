import type { APIEmbed, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import type { Embed } from '../structures/Embed';
import { Transformers } from './Transformers';

class MakeAPIMessage extends null {
  static transform(data: any): RESTPostAPIChannelMessageJSONBody {
    if (!['object', 'string'].includes(typeof data)) throw new TypeError('Message content must be an object or string');

    const parsedData = typeof data === 'string' ? { content: data } : data;

    parsedData.embeds = parsedData.embeds?.map((embed: Embed | APIEmbed) => Transformers.transformMessageEmbeds(embed)) ?? [];

    if (parsedData.messageReference) {
      parsedData.message_reference = Transformers.transformMessageReference(parsedData.messageReference);
    }

    delete parsedData.messageReference;

    return parsedData;
  }
}

export { MakeAPIMessage };
