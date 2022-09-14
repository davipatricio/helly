import type {
  APIGuild,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildHubType,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
} from 'discord-api-types/v10';

export class Guild {
  /**
   * ID of afk channel
   */
  afkChannelId: string | null;
  /**
   * Afk timeout in seconds
   */
  afkTimeout: number;
  /**
   * Application id of the guild creator if it is bot-created
   */
  applicationId: string | null;
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  approximateMemberCount?: number;
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  approximatePresenceCount?: number;
  /**
   * Banner hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  banner: string | null;
  /**
   * Default message notifications level
   * See https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
   */
  defaultMessageNotifications: GuildDefaultMessageNotifications;
  /**
   * The description for the guild
   */
  description: string | null;
  /**
   * Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   */
  discoverySplash: string | null;
  // TODO: Emoji structure
  /**
   * Custom guild emojis
   * See https://discord.com/developers/docs/resources/emoji#emoji-object
   */
  emojis: unknown[];
  /**
   * Explicit content filter level
   * See https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
   */
  explicitContentFilter: GuildExplicitContentFilter;
  /**
   * Enabled guild features
   * See https://discord.com/developers/docs/resources/guild#guild-object-guild-features
   */
  features: GuildFeature[];
  /**
   * The type of Student Hub the guild is
   */
  hubType: GuildHubType | null;
  /**
   * Icon hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  icon: string | null;
  /**
   * Icon hash, retured when in the template object
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  iconHash?: string | null;
  /**
   * Guild id
   */
  id: string;
  /**
   * The maximum number of members for the guild
   */
  maxMembers?: number | null;
  /**
   * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
   */
  maxPresences?: number | null;
  /**
   * The maximum amount of users in a video channel
   */
  maxVideoChannelUsers?: number;
  /**
   * Required MFA level for the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
   */
  mfaLevel: GuildMFALevel;
  /**
   * Guild name (2-100 characters, excluding trailing and leading whitespace)
   */
  name: string;
  /**
   * The nsfw level of the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
   */
  nsfwLevel: GuildNSFWLevel;
  /**
   * `true` if the user is the owner of the guild
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   */
  owner?: boolean;
  /**
   * ID of owner
   */
  ownerId: string;
  /**
   * Total permissions for the user in the guild (excludes overrides)
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   */
  permissions?: string;
  /**
   * The preferred locale of a Community guild; used in guild discovery and notices from Discord
   * @default 'en-US'
   */
  preferredLocale: string;
  /**
   * Whether the guild has the boost progress bar enabled.
   */
  premiumProgressBarEnabled: boolean;
  /**
   * The number of boosts this guild currently has
   */
  premiumSubscriptionCount?: number;
  /**
   * Premium tier (Server Boost level)
   * See https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
   */
  premiumTier: GuildPremiumTier;
  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  publicUpdatesChannelId: string | null;
  /**
   * Voice region id for the guild
   * See https://discord.com/developers/docs/resources/voice#voice-region-object
   * @deprecated This field has been deprecated in favor of `rtc_region` on the channel.
   */
  region: string;
  // TODO: Role structure
  /**
   * Roles in the guild
   * See https://discord.com/developers/docs/topics/permissions#role-object
   */
  roles: unknown[];
  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  rulesChannelId: string | null;
  /**
   * Splash hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  splash: string | null;
  // TODO: Sticker structure
  /**
   * Custom guild stickers
   * See https://discord.com/developers/docs/resources/sticker#sticker-object
   */
  stickers: unknown[];
  /**
   * System channel flags
   * See https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
   */
  systemChannelFlags: GuildSystemChannelFlags;
  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  systemChannelId: string | null;
  /**
   * The vanity url code for the guild
   */
  vanityURLCode: string | null;
  /**
   * Verification level required for the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-verification-level
   */
  verificationLevel: GuildVerificationLevel;
  // TODO: GuildWelcomeScreen structure
  /**
   * The welcome screen of a Community guild, shown to new members
   * Returned in the invite object
   */
  welcomeScreen: unknown;
  /**
   * The channel id that the widget will generate an invite to, or `null` if set to no invite
   */
  widgetChannelId?: string | null;
  /**
   * `true` if the guild widget is enabled
   */
  widgetEnabled?: boolean;
  constructor(data: APIGuild) {
    this.#parseData(data);
  }

  #parseData(data: APIGuild) {
    if ('afk_channel_id' in data) this.afkChannelId = data.afk_channel_id;
    if ('afk_timeout' in data) this.afkTimeout = data.afk_timeout;
    if ('application_id' in data) this.applicationId = data.application_id;
    if ('approximate_member_count' in data) this.approximateMemberCount = data.approximate_member_count;
    if ('approximate_presence_count' in data) this.approximatePresenceCount = data.approximate_presence_count;
    if ('banner' in data) this.banner = data.banner;
    if ('default_message_notifications' in data) this.defaultMessageNotifications = data.default_message_notifications;
    if ('description' in data) this.description = data.description;
    if ('discovery_splash' in data) this.discoverySplash = data.discovery_splash;
    if ('emojis' in data) this.emojis = data.emojis;
    if ('explicit_content_filter' in data) this.explicitContentFilter = data.explicit_content_filter;
    if ('features' in data) this.features = data.features;
    if ('hub_type' in data) this.hubType = data.hub_type;
    if ('icon' in data) this.icon = data.icon;
    if ('icon_hash' in data) this.iconHash = data.icon_hash;
    if ('id' in data) this.id = data.id;
    if ('max_members' in data) this.maxMembers = data.max_members;
    if ('max_presences' in data) this.maxPresences = data.max_presences;
    if ('max_video_channel_users' in data) this.maxVideoChannelUsers = data.max_video_channel_users;
    if ('mfa_level' in data) this.mfaLevel = data.mfa_level;
    if ('name' in data) this.name = data.name;
    if ('nsfw_level' in data) this.nsfwLevel = data.nsfw_level;
    if ('owner' in data) this.owner = data.owner;
    if ('owner_id' in data) this.ownerId = data.owner_id;
    if ('permissions' in data) this.permissions = data.permissions;
    if ('preferred_locale' in data) this.preferredLocale = data.preferred_locale;
    if ('premium_progress_bar_enabled' in data) this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    if ('premium_subscription_count' in data) this.premiumSubscriptionCount = data.premium_subscription_count;
    if ('premium_tier' in data) this.premiumTier = data.premium_tier;
    if ('public_updates_channel_id' in data) this.publicUpdatesChannelId = data.public_updates_channel_id;
    if ('region' in data) this.region = data.region;
    if ('roles' in data) this.roles = data.roles;
    if ('rules_channel_id' in data) this.rulesChannelId = data.rules_channel_id;
    if ('splash' in data) this.splash = data.splash;
    if ('stickers' in data) this.stickers = data.stickers;
    if ('system_channel_flags' in data) this.systemChannelFlags = data.system_channel_flags;
    if ('system_channel_id' in data) this.systemChannelId = data.system_channel_id;
    if ('vanity_url_code' in data) this.vanityURLCode = data.vanity_url_code;
    if ('verification_level' in data) this.verificationLevel = data.verification_level;
    if ('welcome_screen' in data) this.welcomeScreen = data.welcome_screen;
    if ('widget_channel_id' in data) this.widgetChannelId = data.widget_channel_id;
    if ('widget_enabled' in data) this.widgetEnabled = data.widget_enabled;
  }
}
