import { ButtonBuilder as BuilderButton } from '@discordjs/builders';
import type { APIButtonComponentWithCustomId, APIButtonComponentWithURL, ButtonStyle } from 'discord-api-types/v10';

class ButtonBuilder extends BuilderButton {
  get customId() {
    return (this.data as APIButtonComponentWithCustomId).custom_id;
  }

  get label() {
    return this.data.label;
  }

  get url() {
    return (this.data as APIButtonComponentWithURL).url;
  }

  get style(): ButtonStyle | undefined {
    return this.data.style;
  }

  get disabled() {
    return this.data.disabled;
  }
}

export { ButtonBuilder };
