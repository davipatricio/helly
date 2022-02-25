import { APIEmbed, APIMessageReference, APIMessageReferenceSend, ChannelType, MessageFlags as APIMessageFlags } from 'discord-api-types/v10';
import type { MessageReference } from '../structures/Channel';
import { Embed } from '../structures/Embed';
import { MessageFlags } from './MessageFlags';

function transformMessageReference(data: APIMessageReferenceSend | undefined): APIMessageReferenceSend | undefined {
  if (!data) return undefined;
  return {
    message_id: data.message_id,
    guild_id: data.guild_id,
    channel_id: data.channel_id,
    fail_if_not_exists: data.fail_if_not_exists,
  };
}

function transformMessageEmbeds(data: Embed | APIEmbed): APIEmbed | undefined {
  if (!data) return undefined;
  if (data instanceof Embed) return data.toJSON() as APIEmbed;
  return data;
}

function transformMessageFlags(data: MessageFlags | undefined): number | undefined {
  if (!data) return undefined;
  if (data instanceof MessageFlags) return data.bitfield;
  return new MessageFlags(data).bitfield;
}

function parseMessageReference(data: APIMessageReference | undefined): MessageReference | undefined {
  if (!data) return undefined;
  return {
    messageId: data.message_id,
    guildId: data.guild_id,
    channelId: data.channel_id,
  };
}

function parseMessageFlags(data: APIMessageFlags | undefined) {
  if (!data) return undefined;
  return APIMessageFlags[data] as keyof typeof APIMessageFlags;
}

function parseChannelType(data: ChannelType | undefined) {
  if (!data) return undefined;
  return ChannelType[data] as keyof typeof ChannelType;
}

export const Parsers = { parseMessageReference, parseMessageFlags, parseChannelType };
export const Transformers = { transformMessageReference, transformMessageEmbeds, transformMessageFlags };
