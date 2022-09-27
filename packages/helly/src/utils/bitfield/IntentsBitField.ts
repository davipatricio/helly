import { GatewayIntentBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class IntentsBitField extends BitField {
  public static override Flags = GatewayIntentBits;
  override bits: number;
}

IntentsBitField.defaultBit = 0;
