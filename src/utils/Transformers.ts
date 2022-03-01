import { APIEmbed, APIMessageReference, APIMessageReferenceSend, APIRoleTags, ChannelType, MessageFlags } from 'discord-api-types/v10';
import type { RoleTags } from '../structures';
import type { MessageReference } from '../structures/Channel';
import { Embed } from '../structures/Embed';
import { MessageFlagsBitField } from './bitfield/MessageFlagsBitField';

// Transformers

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

function transformMessageFlags(data: MessageFlags | MessageFlagsBitField | undefined): number | undefined {
  if (!data) return undefined;
  if (data instanceof MessageFlagsBitField) return data.bitfield;
  return new MessageFlagsBitField(data).bitfield;
}

// Parsers

function parseMessageReference(data: APIMessageReference | undefined): MessageReference | undefined {
  if (!data) return undefined;
  return {
    messageId: data.message_id,
    guildId: data.guild_id,
    channelId: data.channel_id,
  };
}

function parseMessageFlags(data: MessageFlags | undefined) {
  if (!data) return undefined;
  return MessageFlags[data] as keyof typeof MessageFlags;
}

function parseChannelType(data: ChannelType | undefined) {
  if (!data) return undefined;
  return ChannelType[data] as keyof typeof ChannelType;
}

function parseRoleTags(data: APIRoleTags | undefined): RoleTags {
  return {
    botId: data?.bot_id ?? undefined,
    integrationId: data?.integration_id ?? undefined,
    premiumSubscriber: data?.premium_subscriber ?? null,
  };
}

export const Parsers = { parseMessageReference, parseMessageFlags, parseChannelType, parseRoleTags };
export const Transformers = { transformMessageReference, transformMessageEmbeds, transformMessageFlags };
