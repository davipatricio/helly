import type { APIMessageActivity } from 'discord-api-types/v10';

export class MessageActivity {
  /**
   * Raw MessageActivity object
   */
  data: APIMessageActivity;
  constructor(data: APIMessageActivity) {
    this.#parseData(data);
  }

  /**
   * `party_id` from a Rich Presence event
   * See https://discord.com/developers/docs/rich-presence/how-to#updating-presence-update-presence-payload-fields
   */
  get partyId() {
    return this.data.party_id;
  }

  /**
   * Type of message activity
   * See https://discord.com/developers/docs/resources/channel#message-object-message-activity-types
   */
  get type() {
    return this.data.type;
  }

  #parseData(data: APIMessageActivity) {
    this.data = { ...data };
  }
}
