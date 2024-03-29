import { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export type PermissionResolvable = keyof typeof PermissionFlagsBits | number | PermissionBitField | (keyof typeof PermissionFlagsBits | number | PermissionBitField)[];

export class PermissionBitField extends BitField<PermissionResolvable> {
  public static override Flags = PermissionFlagsBits;
  override bits: bigint;
}

PermissionBitField.defaultBit = 0n;
