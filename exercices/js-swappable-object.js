// NOOOOOOOOOOO

function swappableObject(obj) {
    const target = { ...obj };
    const reverse = {};

    for (const [key, value] of Object.entries(target)) {
        reverse[value] = key;
    }

    return new Proxy(target, {
        get(currentTarget, prop) {
            if (prop in currentTarget) {
                return currentTarget[prop];
            }
            return reverse[prop];
        },
        set(currentTarget, prop, value) {
            if (prop in currentTarget) {
                delete reverse[currentTarget[prop]];
            }

            currentTarget[prop] = value;
            reverse[value] = prop;
            return true;
        },
        deleteProperty(currentTarget, prop) {
            if (prop in currentTarget) {
                delete reverse[currentTarget[prop]];
                delete currentTarget[prop];
            }
            return true;
        }
    });
}
