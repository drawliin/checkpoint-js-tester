function deepFreeze(obj, seen = new WeakSet()) {
    if (obj === null || typeof obj !== "object") {
        throw new Error("Input must be a non-null object");
    }

    if (seen.has(obj)) {
        return obj;
    }

    seen.add(obj);

    Object.keys(obj).forEach(prop => {
        if (obj[prop] !== null && typeof obj[prop] === "object") {
            deepFreeze(obj[prop], seen);
        }
    });

    return Object.freeze(obj);
}
