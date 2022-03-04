import { GatewayActivityUpdateData, PresenceUpdateStatus } from 'discord-api-types/v10';
import { setActivity, setAFK, setStatus } from '../client/websocket/Payloads';
import { User } from './User';

class ClientUser extends User {
  /**
   * Sets/removes the AFK flag for the client user
   * This will clear your activity and status!
   * @example
   * ```js
   * client.user.setAFK(true);
   * ```
   * @example
   * ```js
   * client.user.setAFK(false);
   * ```
   */
  setAFK(afk = true) {
    setAFK(this.client, afk);
  }

  /**
   * Sets the status of the client user
   * This will clear your activity and set the AFK to false!
   * @example
   * ```js
   * client.user.setStatus(PresenceUpdateStatus.Online);
   * ```
   * @example
   * ```js
   * client.user.setStatus('idle');
   * ```
   */
  setStatus(status = PresenceUpdateStatus.Online as PresenceUpdateStatus) {
    setStatus(this.client, status);
  }

  /**
   * Sets the activity the client user is playing
   * This will set the status to Online and set the AFK to false!
   * @example
   * ```js
   * client.user.setActivity({ name: 'with Helly', type: PresenceUpdateStatus.Playing });
   * ```
   * @example
   * ```js
   * client.user.setActivity({ name: 'with Helly', type: 1 });
   * ```
   */
  setActivity(data: GatewayActivityUpdateData) {
    setActivity(this.client, data);
  }
}

export { ClientUser };
