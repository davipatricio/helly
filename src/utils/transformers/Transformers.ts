import { ActionRowBuilder } from '@discordjs/builders';
import type {
  APIActionRowComponent,
  APIApplicationCommand,
  APIButtonComponent,
  APIChannel,
  APIEmbed,
  APIGuild,
  APIGuildWidgetSettings,
  APIMessageActionRowComponent,
  APIMessageReferenceSend,
  APISelectMenuComponent,
  APITextChannel,
  APITextInputComponent,
  MessageFlags,
  RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v10';
import { EmbedBuilder } from '../../builders/Embed';
import type { ApplicationCommand } from '../../structures/ApplicationCommand';
import type { ChannelData, MessageReferenceSend } from '../../structures/Channel';
import type { Guild, GuildWidgetSettingsData } from '../../structures/Guild';
import type { BanOptions } from '../../structures/GuildMember';
import { MessageFlagsBitField } from '../bitfield/MessageFlagsBitField';
import { SystemChannelFlagsBitField } from '../bitfield/SystemChannelFlagsBitField';

class Transformers extends null {
  static applicationCommand(): undefined;
  static applicationCommand(data?: Partial<ApplicationCommand>, guild?: Guild): APIApplicationCommand;
  static applicationCommand(data?: Partial<ApplicationCommand>, guild?: Guild) {
    if (!data) return undefined;
    const parsedData = data as unknown as APIApplicationCommand;
    if (data.nameLocalizations) parsedData.name_localizations = data.nameLocalizations;
    if (data.descriptionLocalizations) parsedData.description_localizations = data.descriptionLocalizations;
    if (data.defaultPermission) parsedData.default_permission = data.defaultPermission;
    if (guild) parsedData.guild_id = guild.id ?? data.guildId;
    return parsedData;
  }

  static messageReference(): undefined;
  static messageReference(data?: MessageReferenceSend): APIMessageReferenceSend;
  static messageReference(data?: MessageReferenceSend) {
    if (!data) return undefined;
    return {
      message_id: data.messageId as string,
      guild_id: data.guildId,
      channel_id: data.channelId,
      fail_if_not_exists: data.failIfNotExists,
    } as APIMessageReferenceSend;
  }

  static messageEmbeds(): undefined;
  static messageEmbeds(data?: EmbedBuilder | APIEmbed): APIEmbed;
  static messageEmbeds(data?: EmbedBuilder | APIEmbed) {
    if (!data) return undefined;
    if (data instanceof EmbedBuilder) return data.toJSON();
    return data;
  }

  static messageFlags(): undefined;
  static messageFlags(data?: MessageFlags | MessageFlagsBitField): number;
  static messageFlags(data?: MessageFlags | MessageFlagsBitField) {
    if (!data) return undefined;
    if (data instanceof MessageFlagsBitField) return data.bitfield;
    return new MessageFlagsBitField(data).bitfield;
  }

  // https://discord.com/developers/docs/resources/channel#modify-channel
  static channelData(): undefined;
  static channelData(data?: ChannelData): APIChannel;
  static channelData(data?: ChannelData): APIChannel | undefined {
    if (!data) return undefined;
    const parsedData = data as unknown as APIChannel;
    if (data.rateLimitPerUser) (parsedData as APITextChannel).rate_limit_per_user = data.rateLimitPerUser;
    return parsedData;
  }

  // https://discord.com/developers/docs/resources/guild#membership-screening-object-json-params
  static guildData(data?: Partial<Guild>) {
    if (!data) return undefined;
    // TODO: add remaining parameters
    const parsedData = data as unknown as APIGuild;
    if (data.afkChannel) parsedData.afk_channel_id = data.afkChannel.id;
    if (data.afkChannelId) parsedData.afk_channel_id = data.afkChannelId;
    if (data.afkTimeout) parsedData.afk_timeout = data.afkTimeout;

    if (data.publicUpdatesChannel) parsedData.public_updates_channel_id = data.publicUpdatesChannel.id;
    if (data.publicUpdatesChannelId) parsedData.public_updates_channel_id = data.publicUpdatesChannelId;

    if (data.rulesChannel) parsedData.rules_channel_id = data.rulesChannel.id;
    if (data.rulesChannelId) parsedData.rules_channel_id = data.rulesChannelId;

    if (data.systemChannel) parsedData.system_channel_id = data.systemChannel.id;
    if (data.systemChannelId) parsedData.system_channel_id = data.systemChannelId;

    if (data.systemChannelFlags instanceof SystemChannelFlagsBitField) parsedData.system_channel_flags = data.systemChannelFlags.bitfield;
    if (typeof data.systemChannelFlags === 'number') parsedData.system_channel_flags = data.systemChannelFlags;

    if (data.ownerId) parsedData.owner_id = data.ownerId;
    if (data.premiumProgressBarEnabled) parsedData.premium_progress_bar_enabled = data.premiumProgressBarEnabled;
    return parsedData;
  }

  static guildWidgetSettings(): undefined;
  static guildWidgetSettings(data?: GuildWidgetSettingsData): APIGuildWidgetSettings;
  static guildWidgetSettings(data?: GuildWidgetSettingsData) {
    if (!data) return undefined;
    return {
      channel_id: data.channelId,
      enabled: data.enabled,
    } as APIGuildWidgetSettings;
  }

  static messageComponents(
    data: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent> | undefined,
  ): APIActionRowComponent<APIButtonComponent | APISelectMenuComponent | APITextInputComponent> | undefined {
    if (!data) return undefined;
    if (data instanceof ActionRowBuilder) return data.toJSON();
    return data;
  }

  static banOptions(): undefined;
  static banOptions(data?: BanOptions): RESTPutAPIGuildBanJSONBody;
  static banOptions(data?: BanOptions) {
    if (!data) return undefined;
    return {
      delete_message_days: data.days,
    } as RESTPutAPIGuildBanJSONBody;
  }
}

export { Transformers };
