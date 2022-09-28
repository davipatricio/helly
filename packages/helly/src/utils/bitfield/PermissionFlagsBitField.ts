import { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export type IntentsResolvable = keyof typeof PermissionFlagsBits | number | PermissionBitField | (keyof typeof PermissionFlagsBits | number | PermissionBitField)[];

export class PermissionBitField extends BitField {
  public static override Flags = PermissionFlagsBits;
  override bits: bigint;
}

PermissionBitField.defaultBit = 0n;
