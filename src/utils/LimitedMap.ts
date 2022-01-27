/**
 * A Map that have a limited size and will remove the oldest items once the max size is reached
 * @param {number} [limit=Infinity] - The maximum size of the map
 * @extends Map
 * @see [MDN Docs]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 */

class LimitedMap<K, V> extends Map<K, V> {
	limit: number;
	constructor(limit = Infinity) {
		super();
		this.limit = limit;
	}

	/**
	 * Adds or updates an element with a specified key and a value
	 * @param {K} key - The key of the element to add or update
	 * @param {V} value - The value of the element to add or update
	 * @returns {any}
	 */
	override set(key: K, value: V): any {
		if (this.limit <= 0) return value;
		if (this.size >= this.limit) {
			this.delete(this.keys().next().value);
		}

		return super.set(key, value);
	}

	/**
	 * Sorts the map with the provided function
	 * @param fn
	 * @returns {any[]}
	 */
	sort(fn: (a: any, b: any) => number): any[] {
		return this.valueArray().sort(fn);
	}

	/**
	 * Returns an array with all keys
	 * @returns {any[]}
	 */
	keyArray(): any[] {
		return [...this.keys()];
	}

	/**
	 * Returns an array with all values
	 * @returns {any[]}
	 */
	valueArray(): any[] {
		return [...this.values()];
	}

	/**
	 * Maps each item to another value into an array
	 * @param fn - Function that produces an element of the new array, taking three arguments
	 * @returns {any[]}
	 */
	map(fn: (value: any, index: number, array: any[]) => any): any[] {
		return this.valueArray().map(fn);
	}

	/**
	 * Returns an array with a random value or N random values
	 * @param {number} [items=1] - The number of values to return
	 * @returns {any|any[]}
	 */
	random(items = 1 as number): any | any[] {
		if (items < 1 || this.size === 0) return [];
		if (items === 1) return this.valueArray()[Math.floor(Math.random() * this.size)];

		if (items >= this.size) return this.valueArray();

		// Select N random items
		const keys: any[] = [];
		for (let i = 0; i < items; i++) {
			keys.push(this.keyArray()[Math.floor(Math.random() * this.size)]);
		}
		return keys;
	}
}

export { LimitedMap };