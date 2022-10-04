import { GuildSystemChannelFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class GuildSystemChannelFlagsBitField extends BitField {
  public static override Flags = GuildSystemChannelFlags;
  override bits: number;
}

GuildSystemChannelFlagsBitField.defaultBit = 0;
