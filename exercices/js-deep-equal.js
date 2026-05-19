function deepEqual(obj1, obj2, seen = new Map()) {
    if (obj1 === obj2) {
        return true;
    }

    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (obj1 instanceof Map && obj2 instanceof Map) {
        if (obj1.size !== obj2.size) return false;

        for (let [key, value] of obj1) {
            if (!obj2.has(key) || obj2.get(key) !== value) {
                return false;
            }
        }

        return true;
    }

    if (obj1 instanceof Set && obj2 instanceof Set) {
        if (obj1.size !== obj2.size) return false;

        for (let value of obj1) {
            if (!obj2.has(value)) {
                return false;
            }
        }

        return true;
    }

    if (
        typeof obj1 !== "object" || obj1 === null ||
        typeof obj2 !== "object" || obj2 === null
    ) {
        return false;
    }

    if (seen.has(obj1)) {
        return seen.get(obj1) === obj2;
    }

    seen.set(obj1, obj2);

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!Object.hasOwn(obj2, key)) {
            return false;
        }

        if (!deepEqual(obj1[key], obj2[key], seen)) {
            return false;
        }
    }

    return true;
}