import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, MessageFlags, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import type { ActionRowBuilder } from '../../builders/ActionRow';
import type { EmbedBuilder } from '../../builders/Embed';
import { MessageFlagsBitField } from '../bitfield';
import { Transformers } from '../transformers/Transformers';

class MakeAPIMessage extends null {
  static transform(data: any): RESTPostAPIChannelMessageJSONBody {
    if (!['object', 'string'].includes(typeof data)) throw new TypeError('Message content must be an object or string');

    const parsedData = typeof data === 'string' ? { content: data } : data;

    parsedData.embeds = parsedData.embeds?.map((embed: EmbedBuilder | APIEmbed) => Transformers.messageEmbeds(embed)) ?? [];
    parsedData.components = parsedData.components?.map((component: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent>) => Transformers.messageComponents(component)) ?? [];

    if (parsedData.flags) {
      if (parsedData.flags instanceof MessageFlagsBitField) parsedData.flags = parsedData.flags.bitfield;
      if (typeof parsedData.flags === 'string' || Array.isArray(parsedData.flags)) parsedData.flags = new MessageFlagsBitField(parsedData.flags).bitfield;
    } else parsedData.flags = 0;

    if (parsedData.messageReference) {
      parsedData.message_reference = Transformers.messageReference(parsedData.messageReference);
    }

    if (typeof parsedData.ephemeral === 'boolean') {
      parsedData.flags |= new MessageFlagsBitField(MessageFlags.Ephemeral).bitfield;
    }

    delete parsedData.messageReference;
    delete parsedData.ephemeral;

    return parsedData;
  }
}

export { MakeAPIMessage };
