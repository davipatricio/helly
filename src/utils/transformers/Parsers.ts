import { APIActionRowComponent, APIMessageActionRowComponent, APIMessageReference, APIRoleTags, MessageFlags } from 'discord-api-types/v10';
import { ActionRowBuilder } from '../../builders/ActionRow';
import type { MessageReference } from '../../structures/Channel';
import type { RoleTags } from '../../structures/Role';

class Parsers extends null {
  static messageComponents(row: APIActionRowComponent<APIMessageActionRowComponent>) {
    const actionRow = new ActionRowBuilder(row);
    return actionRow;
  }

  static messageReference(data?: APIMessageReference): MessageReference | undefined {
    if (!data) return undefined;
    return {
      messageId: data.message_id,
      guildId: data.guild_id,
      channelId: data.channel_id,
    };
  }

  static messageFlags(data?: MessageFlags) {
    if (!data) return undefined;
    return MessageFlags[data] as keyof typeof MessageFlags;
  }

  static roleTags(data: APIRoleTags | undefined): RoleTags {
    return {
      botId: data?.bot_id ?? undefined,
      integrationId: data?.integration_id ?? undefined,
      premiumSubscriber: data?.premium_subscriber ?? null,
    };
  }
}

export { Parsers };
