import type { APIApplicationInstallParams } from 'discord-api-types/v10';

export class ApplicationInstallParams {
  /**
   * Raw ApplicationInstallParams object
   */
  data: APIApplicationInstallParams;
  constructor(data: APIApplicationInstallParams) {
    this.#parseData(data);
  }

  // TODO: permission parsing
  get permissions() {
    return this.data.permissions;
  }

  get scopes() {
    return this.data.scopes;
  }

  #parseData(data: APIApplicationInstallParams) {
    this.data = { ...data };
  }
}
