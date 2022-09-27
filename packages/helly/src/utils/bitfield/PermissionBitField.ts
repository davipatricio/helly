import { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitField } from './BitField';

export class PermissionBitField extends BitField {
  override bits: bigint;
}

PermissionBitField.defaultBit = 0n;
PermissionBitField.Flags = PermissionFlagsBits;
