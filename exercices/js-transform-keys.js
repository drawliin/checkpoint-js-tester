function transformKeys(obj, transformFn) {
    let final = {}
    for (const [key, value] of Object.entries(obj)) {
        const newKey = transformFn(key);
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            final[newKey] = transformKeys(value, transformFn)
        } else {
            final[newKey] = value
        }
    }
    return final

}