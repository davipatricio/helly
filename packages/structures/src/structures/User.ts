import type { APIUser, UserFlags, UserPremiumType } from 'discord-api-types/v10';

export class User {
  /**
   * The user's banner color encoded as an integer representation of hexadecimal color code
   */
  accentColor?: number | null;
  /**
   * The user's avatar hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  avatar: string | null;
  /**
   * The user's banner hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  banner?: string | null;
  /**
   * Whether the user belongs to an OAuth2 application
   */
  bot?: boolean;
  /**
   * The user's 4-digit discord-tag
   */
  discriminator: string;
  /**
   * The user's email
   */
  email?: string | null;
  /**
   * The [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  flags?: UserFlags;
  /**
   * The user's id
   */
  id: string;
  /**
   * The user's chosen language option
   */
  locale?: string;
  /**
   * Whether the user has two factor enabled on their account
   */
  mfaEnabled?: boolean;
  /**
   * The type of Nitro subscription on a user’s account
   * See https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  premiumType?: UserPremiumType;
  /**
   * The public flags on a user’s account
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  publicFlags?: UserFlags;
  /**
   * Whether the user is an Official Discord System user (part of the urgent message system)
   */
  system?: boolean;
  /**
   * The user’s username, not unique across the platform
   */
  username: string;
  /**
   * Whether the email on this account has been verified
   */
  verified?: boolean;
  constructor(data: APIUser) {
    this.#parseData(data);
  }

  #parseData(data: APIUser) {
    if ('accent_color' in data) this.accentColor = data.accent_color;
    if ('avatar' in data) this.avatar = data.avatar;
    if ('banner' in data) this.banner = data.banner;
    if ('bot' in data) this.bot = data.bot;
    if ('discriminator' in data) this.discriminator = data.discriminator;
    if ('email' in data) this.email = data.email;
    if ('flags' in data) this.flags = data.flags;
    if ('id' in data) this.id = data.id;
    if ('locale' in data) this.locale = data.locale;
    if ('mfa_enabled' in data) this.mfaEnabled = data.mfa_enabled;
    if ('premium_type' in data) this.premiumType = data.premium_type;
    if ('public_flags' in data) this.publicFlags = data.public_flags;
    if ('system' in data) this.system = data.system;
    if ('username' in data) this.username = data.username;
    if ('verified' in data) this.verified = data.verified;
  }
}
