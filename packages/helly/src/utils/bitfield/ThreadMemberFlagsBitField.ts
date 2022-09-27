import { ThreadMemberFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class ThreadMemberFlagsBitField extends BitField {
  public static override Flags = ThreadMemberFlags;
  override bits: bigint;
}

ThreadMemberFlagsBitField.defaultBit = 0;
