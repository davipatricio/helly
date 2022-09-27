import { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class PermissionBitField extends BitField {
  public static override Flags = PermissionFlagsBits;
  override bits: bigint;
}

PermissionBitField.defaultBit = 0n;
