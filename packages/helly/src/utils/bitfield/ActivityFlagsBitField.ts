import { ActivityFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class ActivityFlagsBitField extends BitField {
  public static override Flags = ActivityFlags;
  override bits: number;
}

ActivityFlagsBitField.defaultBit = 0;
