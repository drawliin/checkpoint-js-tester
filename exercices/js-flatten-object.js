function flattenObject(obj) {
    let final = {};

    function recurse(current, path="") {
        for (const key of Object.keys(current)) {
            const newPath = path ? `${path}.${key}` : key;

            if (typeof current[key] === "object" && current[key] !== null) {
                recurse(current[key], newPath);
            } else {
                final[newPath] = current[key];
            }
        } 
    }
    recurse(obj)

    return final;
}