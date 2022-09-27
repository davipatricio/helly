import { ApplicationFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class ApplicationFlagsBitField extends BitField {
  public static override Flags = ApplicationFlags;
  override bits: number;
}

ApplicationFlagsBitField.defaultBit = 0;
