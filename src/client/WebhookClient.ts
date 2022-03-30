import { MessageOptions, Webhook } from '../structures';
import type { Client } from './Client';

/** The webhook client */
class WebhookClient {
  /** The id of the webhook */
  id: string;
  /** The token of the webhook */
  token: string;
  /** The webhook representing this client */
  webhook: Webhook;
  /**
   * @param id The id of the webhook
   * @param token The token of the webhook
   */
  constructor(id: string, token: string) {
    if (!id) throw new Error('The id of the webhook is required.');
    if (!token) throw new Error('The token of the webhook is required.');

    this.webhook = new Webhook(this as unknown as Client, { id, token });
  }

  /**
   * Sends a message with this webhook
   * @param content The content of the message
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('...world!')
   * webhook.send({ content: 'Hello...', embeds: [embed] })
   * ```
   * @example
   * ```js
   * webhook.send('I\'m watching you!')
   * ```
   */
  send(content: MessageOptions) {
    return this.webhook.send(content);
  }

  /**
   * Sends a raw slack message with this webhook
   * @param message The data to send
   * @example
   * ```js
   * webhook.sendSlackMessage({
   *  'username': 'Wumpus',
   *  'attachments': [{
   *    'pretext': 'this looks pretty cool',
   *    'color': '#F0F',
   *    'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
   *    'footer': 'Powered by sneks',
   *    'ts': Date.now() / 1_000
   *  }]
   * })
   * ```
   * @see https://api.slack.com/incoming-webhooks
   * @see https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook
   */
  sendSlackMessage(message: Record<string, unknown>) {
    return this.webhook.sendSlackMessage(message);
  }

  /** Gets a message that was sent by this webhook */
  fetchMessage(id: string) {
    return this.webhook.fetchMessage(id);
  }
}

export { WebhookClient };
