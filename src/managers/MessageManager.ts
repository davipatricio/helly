import type { APIMessage } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Message } from '../structures/Message';

// TODO: MessageManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Guild}s */
class MessageManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** A Collection of all the messages the client is currently handling, mapped by their Ids */
  get cache() {
    return this.client.caches.messages;
  }

  /**
   * Updates or caches a {@link Message} with the provided {@link APIMessage} data
   * @private
   */
  updateOrSet(id: string, data: APIMessage | Message) {
    if (data instanceof Message) {
      return data.parseData(data.data);
    }

    const cachedMessage = this.client.caches.messages.get(id);
    if (cachedMessage) return cachedMessage.parseData(data);

    const message = new Message(this.client, data);
    this.client.caches.messages.set(id, message);

    return message;
  }
}

export { MessageManager };
