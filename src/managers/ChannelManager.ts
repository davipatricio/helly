import { APIChannel, APIMessage, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Channel, MessageOptions } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import { Message } from '../structures/Message';
import { MakeAPIMessage } from '../utils/MakeAPIMessage';

// TODO: ChannelManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Channel}s */
class ChannelManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** A manager of the channels belonging to this client */
  get cache() {
    return this.client.caches.channels;
  }

  /**
   * Sends a message to this channel
   * @param content - The content of the message
   * @example
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * guild.channels.send('12345678901234567', { embeds: [embed] })
   * @example
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * guild.channels.send'12345678901234567', ({ content: 'Ping?', embeds: [embed] })
   * @example
   * guild.channels.send('12345678901234567', 'Hello world!')
   */
  async send(channelId: string, content: MessageOptions) {
    // TODO: Create Message structure
    const parsedMessage = MakeAPIMessage.transform(content);
    const data = await this.client.rest.make(Routes.channelMessages(channelId), 'POST', parsedMessage);
    return new Message(this.client, data as APIMessage);
  }

  /**
   * Updates or caches a {@link Channel} with the provided {@link APIChannel} data
   * @private
   */
  updateOrSet(id: string, data: APIChannel, guild?: Guild) {
    const cachedChannel = this.client.caches.channels.get(id);
    if (cachedChannel) return cachedChannel.parseData(data, guild);

    const channel = new Channel(this.client, data, guild);
    this.client.caches.channels.set(id, channel);

    return channel;
  }
}

export { ChannelManager };
