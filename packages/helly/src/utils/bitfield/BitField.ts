type AcceptedInputTypes = bigint | number | string | (bigint | number | string)[];

function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor;
}

interface BitFieldStaticFields {
  defaultBit: bigint | number;
  Flags: Record<string, bigint | number>;
}

@staticImplements<BitFieldStaticFields>()
export class BitField {
  public static defaultBit: bigint | number;
  public static Flags: Record<string, bigint | number>;
  bits: number | bigint;
  // https://stackoverflow.com/questions/33387318/access-to-static-properties-via-this-constructor-in-typescript
  ['constructor']: typeof BitField;
  constructor(defaultBit: number) {
    this.add(defaultBit);
  }

  get bitfield() {
    return this.bits;
  }

  add(bits: AcceptedInputTypes) {
    (this.bits as number) |= this.parse(bits);
    return this;
  }

  equals(bits: AcceptedInputTypes) {
    return this.bits === this.parse(bits);
  }

  has(bits: AcceptedInputTypes) {
    return ((this.bits as number) & this.parse(bits)) === this.parse(bits);
  }

  parse(bits: AcceptedInputTypes) {
    if (typeof bits === 'bigint' || typeof bits === 'number') return bits;
    if (Array.isArray(bits)) {
      return bits.map(bit => this.parse(bit)).reduce((a, b) => a | b, this.constructor.defaultBit);
    }
    if (typeof bits === 'string') {
      if (typeof this.constructor.defaultBit === 'bigint') return BigInt(bits);
      return Number(bits);
    }
    throw new Error('Invalid bitfield type');
  }

  remove(bits: AcceptedInputTypes) {
    (this.bits as number) &= ~this.parse(bits);
    return this;
  }

  serialize() {
    return this.bits;
  }

  toArray() {
    const flags = Object.keys(this.constructor.Flags);
    return flags.filter(flag => this.has(flag));
  }
}

BitField.defaultBit = 0;
BitField.Flags = {};
