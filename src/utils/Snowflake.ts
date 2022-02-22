/* eslint-disable no-plusplus */
const epoch = new Date('2015-01-01T00:00:00.000Z').getTime();
let INCREMENT = BigInt(0);

/** Utility class for working with Snowflakes */
class Snowflake extends null {
  /**
   * Deconstructs a Discord snowflake
   * @param id - The snowflake to deconstruct
   * @example
   * ```js
   * const timestamp = Snowflake.deconstruct('934675087108481044');
   * ```
   */
  static deconstruct(id: string | bigint) {
    const bigIntSnowflake = BigInt(id);
    return Number(bigIntSnowflake >> 22n) + epoch;
  }

  /**
   * Generates a Discord snowflake
   * @param timestamp - Timestamp of the snowflake to generate
   */
  static generate(timestamp = Date.now() as number) {
    if (INCREMENT >= 4095n) INCREMENT = BigInt(0);

    // Assign WorkerId as 1 and ProcessId as 0:
    return ((BigInt(timestamp - epoch) << 22n) | (1n << 17n) | INCREMENT++).toString();
  }
}

export { Snowflake };
