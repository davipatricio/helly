import type { APIUser } from 'discord-api-types/v10';

export class User {
  /**
   * Raw User object
   */
  data: APIUser;
  constructor(data: APIUser) {
    this.#parseData(data);
  }

  /**
   * The user's banner color encoded as an integer representation of hexadecimal color code
   */
  get accentColor() {
    return this.data.accent_color;
  }

  /**
   * The user's avatar hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get avatar() {
    return this.data.avatar;
  }

  /**
   * The user's banner hash
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  get banner() {
    return this.data.banner;
  }

  /**
   * Whether the user belongs to an OAuth2 application
   */
  get bot() {
    return this.data.bot;
  }

  /**
   * The user's 4-digit discord-tag
   */
  get discriminator() {
    return this.data.discriminator;
  }

  /**
   * The user's email
   */
  get email() {
    return this.data.email;
  }

  // TODO: UserFlags structure
  /**
   * The [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * The user's id
   */
  get id() {
    return this.data.id;
  }

  /**
   * The user's chosen language option
   */
  get locale() {
    return this.data.locale;
  }

  /**
   * Whether the user has two factor enabled on their account
   */
  get mfaEnabled() {
    return this.data.mfa_enabled;
  }

  /**
   * The type of Nitro subscription on a user’s account
   * See https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  get premiumType() {
    return this.data.premium_type;
  }

  // TODO: UserFlags structure
  /**
   * The public flags on a user’s account
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  get publicFlags() {
    return this.data.public_flags;
  }

  /**
   * Whether the user is an Official Discord System user (part of the urgent message system)
   */
  get system() {
    return this.data.system;
  }

  /**
   * The user’s username, not unique across the platform
   */
  get username() {
    return this.data.username;
  }

  /**
   * Whether the email on this account has been verified
   */
  get verified() {
    return this.data.verified;
  }

  #parseData(data: APIUser) {
    this.data = { ...data };
  }
}
