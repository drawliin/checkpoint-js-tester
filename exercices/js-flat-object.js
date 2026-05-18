function flattenAndMap(obj, mapper) {
    let final = {};
    let transformedKeysCount = 0;
    let originalKeysCount = 0;

    function recurse(current, path = "") {
        for (const [key, value] of Object.entries(current)) {
            const newPath = path ? `${path}.${key}` : key;

            if (typeof value == "object" && value != null && !Array.isArray(value)) {
                recurse(value, newPath);
            } else {
                originalKeysCount++
                let mapperdValue;
                if (Array.isArray(value)) {
                    mapperdValue = value.map(mapper);
                } else {
                    mapperdValue= mapper(value);
                }

                final[newPath] = mapperdValue
                transformedKeysCount++;
            }
        }
    }

    recurse(obj)


    return {
        flattened: final,
        originalKeysCount,
        transformedKeysCount
    }
}

