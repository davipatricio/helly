import type { APIApplication } from 'discord-api-types/v10';
import { User } from './User';

export class Application {
  /**
   * Raw Application object
   */
  data: APIApplication;
  constructor(data: APIApplication) {
    this.#parseData(data);
  }

  /**
   * When `false` only app owner can join the app’s bot to guilds
   */
  get botPublic() {
    return this.data.bot_public;
  }

  /**
   * When `true` the app’s bot will only join upon completion of the full oauth2 code grant flow
   */
  get botRequireCodeGrant() {
    return this.data.bot_require_code_grant;
  }

  /**
   * If this application is a game sold on Discord, this field will be the hash of the image on store embeds
   */
  get coverImage() {
    return this.data.cover_image;
  }

  /**
   * The application’s default custom authorization link, if enabled
   */
  get customInstallUrl() {
    return this.data.custom_install_url;
  }

  /**
   * The description of the app
   */
  get description() {
    return this.data.description;
  }

  // TODO: ApplicationFlags
  /**
   * The application’s public flags
   * See https://discord.com/developers/docs/resources/application#application-object-application-flags
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * If this application is a game sold on Discord, this field will be the guild to which it has been linked
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The icon hash of the app
   */
  get icon() {
    return this.data.icon;
  }

  /**
   * The id of the app
   */
  get id() {
    return this.data.id;
  }

  // TODO: ApplicationInstallParams
  /**
   * Settings for the application’s default in-app authorization link, if enabled
   */
  get installParams() {
    return this.data.install_params;
  }

  /**
   * The name of the app
   */
  get name() {
    return this.data.name;
  }

  /**
   * Partial user object containing info on the owner of the application
   * See https://discord.com/developers/docs/resources/user#user-object
   */
  get owner() {
    return this.data.owner ? new User(this.data.owner) : undefined;
  }

  /**
   * If this application is a game sold on Discord, this field will be the id of the “Game SKU” that is created, if exists
   */
  get primarySkuId() {
    return this.data.primary_sku_id;
  }

  /**
   * The url of the application’s privacy policy
   */
  get privacyPolicyUrl() {
    return this.data.privacy_policy_url;
  }

  /**
   * An array of rpc origin urls, if rpc is enabled
   */
  get rpcOrigins() {
    return this.data.rpc_origins;
  }

  /**
   * If this application is a game sold on Discord, this field will be the URL slug that links to the store page
   */
  get slug() {
    return this.data.slug;
  }

  /**
   * An empty string
   * @deprecated This field will be removed in v11
   */
  get summary() {
    return this.data.summary;
  }

  /**
   * Up to 5 tags describing the content and functionality of the application
   */
  get tags() {
    return this.data.tags;
  }

  // TODO: team structure
  /**
   * The team this application belongs to
   * See https://discord.com/developers/docs/topics/teams#data-models-team-object
   */
  get team() {
    return this.data.team;
  }

  /**
   * The url of the application’s terms of service
   */
  get termsOfServiceUrl() {
    return this.data.terms_of_service_url;
  }

  /**
   * The hexadecimal encoded key for verification in interactions and the GameSDK’s GetTicket function
   * See https://discord.com/developers/docs/game-sdk/applications#getticket
   */
  get verifyKey() {
    return this.data.verify_key;
  }

  /**
   *
   */
  #parseData(data: APIApplication) {
    this.data = { ...data };
  }
}
