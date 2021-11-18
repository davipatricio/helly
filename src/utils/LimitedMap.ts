/**
 * A Map that have a limited size and will remove the oldest items once the max size is reached
 * @param {number} [limit=Infinity] - The maximum size of the map
 * @extends Map
 */
class LimitedMap<K, V> extends Map<K, V> {
    limit: number;
    constructor(limit = Infinity) {
        super();
        this.limit = limit;
    }

    set(key: K, value: V): any {
        if (this.limit <= 0) return value;
        if (this.size >= this.limit) {
            this.delete(this.keys().next().value);
        }

        super.set(key, value);
        return value;
    }

    /**
     * Returns an array with all keys
     * @returns {Array}
     */
    keyArray(): Array<any> {
        return [...this.keys()];
    }

    /**
     * Returns an array with all values
     * @returns {Array}
     */
    valueArray(): Array<any> {
        return [...this.values()];
    }

    /**
     * Returns an array with a random value or N random values
     * @param {number} [items=1] - The number of values to return
     * @returns {*|Array<*>}
     */
    random(items = 1 as number) {
        if (items < 1 || this.size === 0) return [];
        if (items === 1) return this.valueArray()[Math.floor(Math.random() * this.size)];

        if (items >= this.size) return this.valueArray();

        // Select N random items
        const keys: Array<any> = [];
        for (let i = 0; i < items; i++) {
            keys.push(this.keyArray()[Math.floor(Math.random() * this.size)]);
        }
        return keys;
    }
}

export default LimitedMap;
