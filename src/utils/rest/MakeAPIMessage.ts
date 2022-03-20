import type { ActionRowBuilder, EmbedBuilder, UnsafeEmbedBuilder } from '@discordjs/builders';
import type { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { Transformers } from '../Transformers';

class MakeAPIMessage extends null {
  static transform(data: any): RESTPostAPIChannelMessageJSONBody {
    if (!['object', 'string'].includes(typeof data)) throw new TypeError('Message content must be an object or string');

    const parsedData = typeof data === 'string' ? { content: data } : data;

    parsedData.embeds = parsedData.embeds?.map((embed: EmbedBuilder | UnsafeEmbedBuilder | APIEmbed) => Transformers.transformMessageEmbeds(embed)) ?? [];
    parsedData.components = parsedData.components?.map((component: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent>) => Transformers.transformMessageComponents(component)) ?? [];

    if (parsedData.messageReference) {
      parsedData.message_reference = Transformers.transformMessageReference(parsedData.messageReference);
    }

    delete parsedData.messageReference;

    return parsedData;
  }
}

export { MakeAPIMessage };
