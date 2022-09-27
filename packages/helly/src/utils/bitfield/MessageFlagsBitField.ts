import { MessageFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class MessageFlagsBitField extends BitField {
  public static override Flags = MessageFlags;
  override bits: number;
}

MessageFlagsBitField.defaultBit = 0n;
