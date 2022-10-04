import type { APITeam } from 'discord-api-types/v10';
import { TeamMember } from './TeamMember';

export class Team {
  /**
   * Raw Team object
   */
  data: APITeam;
  constructor(data: APITeam) {
    this.#parseData(data);
  }

  /**
   * A hash of the image of the team’s icon
   */
  get icon() {
    return this.data.icon;
  }

  /**
   * The unique id of the team
   */
  get id() {
    return this.data.id;
  }

  /**
   * The members of the team
   */
  get members() {
    return this.data.members.map(member => new TeamMember(member));
  }

  /**
   * The name of the team
   */
  get name() {
    return this.data.name;
  }

  /**
   * The user id of the current team owner
   */
  get ownerUserId() {
    return this.data.owner_user_id;
  }

  #parseData(data: APITeam) {
    this.data = { ...data };
  }
}
