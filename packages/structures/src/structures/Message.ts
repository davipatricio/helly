import type { APIApplication, APIMessage } from 'discord-api-types/v10';
import { Application } from './Application';
import { MessageActivity } from './MessageActivity';

export class Message {
  /**
   * Raw Message object
   */
  data: APIMessage;
  constructor(data: APIMessage) {
    this.#parseData(data);
  }

  /**
   * Sent with Rich Presence-related chat embeds
   * See https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
  get activity() {
    return this.data.activity ? new MessageActivity(this.data.activity) : undefined;
  }

  /**
   * Sent with Rich Presence-related chat embeds
   * See https://discord.com/developers/docs/resources/application#application-object
   */
  get application() {
    return this.data.application ? new Application(this.data.application as APIApplication) : null;
  }

  /**
   * If the message is a response to an Interaction, this is the id of the interaction’s application
   */
  get applicationId() {
    return this.data.application_id;
  }

  #parseData(data: APIMessage) {
    this.data = { ...data };
  }
}
