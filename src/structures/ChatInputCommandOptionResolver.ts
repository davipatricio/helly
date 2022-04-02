import {
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

class ChatInputCommandOptionResolver {
  /** Raw {@link ChatInputCommandOptionResolver} data */
  data: APIApplicationCommandInteractionDataOption[];
  constructor(data: APIApplicationCommandInteractionDataOption[]) {
    this.data = data ?? [];
  }

  #mergeSubCommandOptions(_options: (APIApplicationCommandInteractionDataOption | APIApplicationCommandInteractionDataSubcommandOption)[] = this.data): APIApplicationCommandInteractionDataOption[] {
    const opts = _options.map(option => {
      switch (option.type) {
        case ApplicationCommandOptionType.Subcommand:
          return option.options;
        case ApplicationCommandOptionType.SubcommandGroup:
          return option.options?.map(o => this.#mergeSubCommandOptions(o.options));
        default:
          return option;
      }
    });
    return opts.flat(Infinity) as unknown as APIApplicationCommandInteractionDataOption[];
  }

  /**
   * Gets an option by its name
   * @param name The name of the option
   * @param requiredWhether to throw an error if the option is not found
   * @returns The value of the option. Undefined if the value was not provided
   */
  get(name: string, required = false) {
    const found = this.#mergeSubCommandOptions().find(opt => opt.name === name) as APIApplicationCommandInteractionDataOption | undefined;
    if (!found) {
      if (required) throw new Error(`Option ${name} is required but does not have a value`);
      return undefined;
    }
    return found;
  }

  /**
   * Gets a string option
   * @param name The name of the option
   * @param required Whether to throw an error if the option is not found
   * @returns The value of the option. Undefined if the value was not provided
   */
  getString(name: string, required = false) {
    const found = this.#mergeSubCommandOptions()
      .filter(option => option.type === ApplicationCommandOptionType.String)
      .find(opt => opt.name === name) as APIApplicationCommandInteractionDataStringOption | undefined;
    if (!found) {
      if (required) throw new Error(`Option ${name} is required but does not have a value`);
      return undefined;
    }
    return found.value;
  }

  /**
   * Gets a number option
   * @param name The name of the option
   * @param required Whether to throw an error if the option is not found
   * @returns The value of the option. Undefined if the value was not provided
   */
  getNumber(name: string, required = false) {
    const found = this.#mergeSubCommandOptions()
      .filter(option => option.type === ApplicationCommandOptionType.Number)
      .find(opt => opt.name === name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (!found) {
      if (required) throw new Error(`Option ${name} is required but does not have a value`);
      return undefined;
    }
    return found.value;
  }

  /**
   * Gets an integer option
   * @param name The name of the option
   * @param required Whether to throw an error if the option is not found
   * @returns The value of the option. Undefined if the value was not provided
   */
  getInteger(name: string, required = false) {
    const found = this.#mergeSubCommandOptions()
      .filter(option => option.type === ApplicationCommandOptionType.Integer)
      .find(opt => opt.name === name) as APIApplicationCommandInteractionDataIntegerOption | undefined;
    if (!found) {
      if (required) throw new Error(`Option ${name} is required but does not have a value`);
      return undefined;
    }
    return found.value;
  }
}

export { ChatInputCommandOptionResolver };
