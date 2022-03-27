import type { ActionRowBuilder } from '@discordjs/builders';
import type { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import type { EmbedBuilder } from '../../builders/Embed';
import { Transformers } from '../transformers/Transformers';

class MakeAPIMessage extends null {
  static transform(data: any): RESTPostAPIChannelMessageJSONBody {
    if (!['object', 'string'].includes(typeof data)) throw new TypeError('Message content must be an object or string');

    const parsedData = typeof data === 'string' ? { content: data } : data;

    parsedData.embeds = parsedData.embeds?.map((embed: EmbedBuilder | APIEmbed) => Transformers.messageEmbeds(embed)) ?? [];
    parsedData.components = parsedData.components?.map((component: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent>) => Transformers.messageComponents(component)) ?? [];

    if (parsedData.messageReference) {
      parsedData.message_reference = Transformers.messageReference(parsedData.messageReference);
    }

    delete parsedData.messageReference;

    return parsedData;
  }
}

export { MakeAPIMessage };
