import type { APITeamMember } from 'discord-api-types/v10';
import { User } from './User';

export class TeamMember {
  /**
   * Raw TeamMember object
   */
  data: APITeamMember;
  constructor(data: APITeamMember) {
    this.#parseData(data);
  }

  /**
   * The user’s membership state on the team
   * See https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum
   */
  get membershipState() {
    return this.data.membership_state;
  }

  /**
   * Will always be ["*"]
   */
  get permissions() {
    return this.data.permissions;
  }

  /**
   * The id of the parent team of which they are a member
   */
  get teamId() {
    return this.data.team_id;
  }

  /**
   * The avatar, discriminator, id, and username of the user
   * See https://discord.com/developers/docs/resources/user#user-object
   */
  get user() {
    return new User(this.data.user);
  }

  /**
   *
   * @param data
   */
  #parseData(data: APITeamMember) {
    this.data = { ...data };
  }
}
