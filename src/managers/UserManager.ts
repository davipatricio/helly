import { APIDMChannel, APIUser, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Channel, User } from '../structures';

/** Manages API methods for {@link User}s */
class UserManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** A manager of the users belonging to this client */
  get cache() {
    return this.client.caches.users;
  }

  /** Creates a DM{@link Channel} between the client and a user */
  async createDM(id: string) {
    const data = await this.client.rest.make(Routes.userChannels(), 'POST', { recipient_id: id });
    return new Channel(this.client, data as APIDMChannel);
  }

  /** Obtains a user from Discord, or the user cache if it's already available */
  async fetch(id: string) {
    const data = await this.client.rest.make(Routes.user(id));
    return this.updateOrSet(id, data as APIUser);
  }

  /**
   * Updates or caches a {@link User} with the provided {@link APIUser} data
   * @private
   */
  updateOrSet(id: string, data: APIUser) {
    const cachedUser = this.client.caches.users.get(id);
    if (cachedUser) return cachedUser.parseData(data);

    const user = new User(this.client, data);
    this.client.caches.users.set(id, user);

    return user;
  }
}

export { UserManager };
