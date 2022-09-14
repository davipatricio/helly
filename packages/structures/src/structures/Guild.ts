import type { APIGuild } from 'discord-api-types/v10';
import { GuildWelcomeScreen } from './GuildWelcomeScreen';
import { Sticker } from './Sticker';

export class Guild {
  /**
   * Raw Guild object
   */
  data: APIGuild;
  constructor(data: APIGuild) {
    this.#parseData(data);
  }

  /**
   * ID of afk channel
   */
  get afkChannelId() {
    return this.data.afk_channel_id;
  }

  /**
   * Afk timeout in seconds
   */
  get afkTimeout() {
    return this.data.afk_timeout;
  }

  /**
   * Application id of the guild creator if it is bot-created
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  get approximateMemberCount() {
    return this.data.approximate_member_count;
  }

  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  get approximatePresenceCount() {
    return this.data.approximate_presence_count;
  }

  /**
   * Banner hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get banner() {
    return this.data.banner;
  }

  /**
   * Default message notifications level
   * See https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
   */
  get defaultMessageNotifications() {
    return this.data.default_message_notifications;
  }

  /**
   * The description for the guild
   */
  get description() {
    return this.data.description;
  }

  /**
   * Discovery splash hash only present for guilds with the "DISCOVERABLE" feature
   */
  get discoverySplash() {
    return this.data.discovery_splash;
  }

  // TODO: Emoji structure
  /**
   * Custom guild emojis
   * See https://discord.com/developers/docs/resources/emoji#emoji-object
   */
  get emojis() {
    return this.data.emojis;
  }

  /**
   * Explicit content filter level
   * See https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
   */
  get explicitContentFilter() {
    return this.data.explicit_content_filter;
  }

  /**
   * Enabled guild features
   * See https://discord.com/developers/docs/resources/guild#guild-object-guild-features
   */
  get features() {
    return this.data.features;
  }

  /**
   * The type of Student Hub the guild is
   */
  get hubType() {
    return this.data.hub_type;
  }

  /**
   * Icon hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get icon() {
    return this.data.icon;
  }

  /**
   * Icon hash, retured when in the template object
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get iconHash() {
    return this.data.icon_hash;
  }

  /**
   * Guild id
   */
  get id() {
    return this.data.id;
  }

  /**
   * The maximum number of members for the guild
   */
  get maxMembers() {
    return this.data.max_members;
  }

  /**
   * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
   */
  get maxPresences() {
    return this.data.max_presences;
  }

  /**
   * The maximum amount of users in a video channel
   */
  get maxVideoChannelUsers() {
    return this.data.max_video_channel_users;
  }

  /**
   * Required MFA level for the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
   */
  get mfaLevel() {
    return this.data.mfa_level;
  }

  /**
   * Guild name (2-100 characters, excluding trailing and leading whitespace)
   */
  get name() {
    return this.data.name;
  }

  /**
   * The nsfw level of the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
   */
  get nsfwLevel() {
    return this.data.nsfw_level;
  }

  /**
   * `true` if the user is the owner of the guild
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   */
  get owner() {
    return this.data.owner;
  }

  /**
   * ID of owner
   */
  get ownerId() {
    return this.data.owner_id;
  }

  // TODO: better permission parsing
  /**
   * Total permissions for the user in the guild (excludes overrides)
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   */
  get permissions() {
    return this.data.permissions;
  }

  /**
   * The preferred locale of a Community guild used in guild discovery and notices from Discord
   * @default 'en-US'
   */
  get preferredLocale() {
    return this.data.preferred_locale;
  }

  /**
   * Whether the guild has the boost progress bar enabled.
   */
  get premiumProgressBarEnabled() {
    return this.data.premium_progress_bar_enabled;
  }

  /**
   * The number of boosts this guild currently has
   */
  get premiumSubscriptionCount() {
    return this.data.premium_subscription_count;
  }

  /**
   * Premium tier (Server Boost level)
   * See https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
   */
  get premiumTier() {
    return this.data.premium_tier;
  }

  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  get publicUpdatesChannelId() {
    return this.data.public_updates_channel_id;
  }

  /**
   * Voice region id for the guild
   * See https://discord.com/developers/docs/resources/voice#voice-region-object
   * @deprecated This field has been deprecated in favor of `rtc_region` on the channel.
   */
  get region() {
    return this.data.region;
  }

  // TODO: {}Role structure
  /**
   * Roles in the guild
   * See https://discord.com/developers/docs/topics/permissions#role-object
   */
  get roles() {
    return this.data.roles;
  }

  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  get rulesChannelId() {
    return this.data.rules_channel_id;
  }

  /**
   * Splash hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get splash() {
    return this.data.splash;
  }

  /**
   * Custom guild stickers
   * See https://discord.com/developers/docs/resources/sticker#sticker-object
   */
  get stickers() {
    return this.data.stickers.map(sticker => new Sticker(sticker));
  }

  /**
   * System channel flags
   * See https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
   */
  get systemChannelFlags() {
    return this.data.system_channel_flags;
  }

  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  get systemChannelId() {
    return this.data.system_channel_id;
  }

  /**
   * The vanity url code for the guild
   */
  get vanityURLCode() {
    return this.data.vanity_url_code;
  }

  /**
   * Verification level required for the guild
   * See https://discord.com/developers/docs/resources/guild#guild-object-verification-level
   */
  get verificationLevel() {
    return this.data.verification_level;
  }

  /**
   * The welcome screen of a Community guild, shown to new members
   * Returned in the invite object
   * */
  get welcomeScreen() {
    return this.data.welcome_screen ? new GuildWelcomeScreen(this.data.welcome_screen) : null;
  }

  /**
   * The channel id that the widget will generate an invite to, or `null` if set to no invite
   */
  get widgetChannelId() {
    return this.data.widget_channel_id;
  }

  /**
   * `true` if the guild widget is enabled
   */
  get widgetEnabled() {
    return this.data.widget_enabled;
  }

  #parseData(data: APIGuild) {
    this.data = { ...data };
  }
}
