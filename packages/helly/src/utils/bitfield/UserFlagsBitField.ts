import { UserFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class UserFlagsBitField extends BitField {
  public static override Flags = UserFlags;
  override bits: number;
}

UserFlagsBitField.defaultBit = 0;
