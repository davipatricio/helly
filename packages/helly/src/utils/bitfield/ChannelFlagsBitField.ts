import { ChannelFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class ChannelFlagsBitField extends BitField {
  public static override Flags = ChannelFlags;
  override bits: number;
}

ChannelFlagsBitField.defaultBit = 0;
