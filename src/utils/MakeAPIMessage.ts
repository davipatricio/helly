import type { APIEmbed, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { Embed } from '../structures/Embed';

class MakeAPIMessage extends null {
  static transform(data: any): RESTPostAPIChannelMessageJSONBody {
    if (!['object', 'string'].includes(typeof data)) throw new TypeError('Message content must be an object or string');

    const parsedData = data === 'string' ? { content: data } : data;

    parsedData.embeds = parsedData.embeds?.map((embed: (Embed | APIEmbed)[]) => (embed instanceof Embed ? embed.toJSON() : embed)) ?? [];

    if (parsedData.messageReference) {
      parsedData.message_reference = {
        message_id: parsedData.messageReference.messageId,
        channel_id: parsedData.messageReference.channelId,
        guild_id: parsedData.messageReference.guildId,
        fail_if_not_exists: parsedData.messageReference.failIfNotExists,
      };
      delete parsedData.messageReference;
    }

    return parsedData;
  }
}

export { MakeAPIMessage };
