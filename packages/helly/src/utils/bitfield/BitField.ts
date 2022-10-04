/**
 * Data that can be resolved to give a bitfield. This can be:
 * - A number
 * - A bigint
 * - A string (representing a bit or bitfield)
 * - An instance of BitField
 * - An Array of BitFieldResolvable
 */
export type BitFieldResolvable = BitField | bigint | number | string | (BitField | bigint | number | string)[];

function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor;
}

interface BitFieldStaticFields {
  defaultBit: bigint | number;
  Flags: Record<string, unknown>;
}

@staticImplements<BitFieldStaticFields>()
export class BitField<Resolvable = BitFieldResolvable> {
  public static defaultBit: bigint | number;
  public static Flags = {};
  bits: number | bigint;
  // https://stackoverflow.com/questions/33387318/access-to-static-properties-via-this-constructor-in-typescript
  ['constructor']: typeof BitField;
  constructor(bits: Resolvable) {
    this.add(bits);
  }

  get bitfield() {
    return this.bits;
  }

  add(bits: Resolvable) {
    (this.bits as number) |= this.parse(bits);
    return this;
  }

  equals(bits: Resolvable) {
    return this.bits === this.parse(bits);
  }

  has(bits: Resolvable) {
    return ((this.bits as number) & this.parse(bits)) === this.parse(bits);
  }

  parse(bits: Resolvable) {
    if (typeof bits === 'bigint' || typeof bits === 'number') return bits;
    if (Array.isArray(bits)) {
      return (bits as Resolvable[]).map(bit => this.parse(bit)).reduce((a, b) => a | b, this.constructor.defaultBit);
    }
    if (typeof bits === 'string') {
      if (typeof this.constructor.defaultBit === 'bigint') return BigInt(bits);
      return Number(bits);
    }
    if (bits instanceof this.constructor) return bits.bitfield;
    throw new Error('Invalid bitfield type');
  }

  remove(bits: Resolvable) {
    (this.bits as number) &= ~this.parse(bits);
    return this;
  }

  serialize() {
    return this.bits;
  }

  toArray() {
    const flags = Object.keys(this.constructor.Flags) as unknown as Resolvable[];
    return flags.filter(flag => this.has(flag));
  }
}

BitField.defaultBit = 0;
BitField.Flags = {};
