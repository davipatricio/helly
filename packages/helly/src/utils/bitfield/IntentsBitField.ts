import { GatewayIntentBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export type IntentsResolvable = keyof typeof GatewayIntentBits | number | IntentsBitField | (keyof typeof GatewayIntentBits | number | IntentsBitField)[];

export class IntentsBitField extends BitField<keyof typeof GatewayIntentBits> {
  public static override Flags = GatewayIntentBits;
  override bits: number;
}

IntentsBitField.defaultBit = 0;
