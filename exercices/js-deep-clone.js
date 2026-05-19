function deepClone(value, seen = new Map()) {
    if (typeof value !== "object" || value === null) {
        return value;
    }

    if (seen.has(value)) {
        return seen.get(value);
    }

    const clone = Array.isArray(value) ? [] : {};

    seen.set(value, clone);

    for (let key of Object.keys(value)) {
        clone[key] = deepClone(value[key], seen);
    }

    return clone;
}