import type { APIEmbed, APIMessage } from 'discord-api-types/v10';
import { Embed } from '../structures/Embed';

class MakeAPIMessage extends null {
  static transform(data: any): Partial<APIMessage> {
    let parsedData = data;

    if (typeof parsedData === 'string') parsedData = { content: data };

    parsedData.embeds = parsedData.embeds?.map((embed: (Embed | APIEmbed)[]) => (embed instanceof Embed ? embed.toJSON() : embed)) ?? [];

    return parsedData;
  }
}

export { MakeAPIMessage };
