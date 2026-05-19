function deepFind(obj, path) {
    if (typeof obj !== "object" || obj == null || Array.isArray(obj)) {
        throw new Error("Input must be a non-null object")
    }
    
    if (typeof path !== "string") {
        throw new Error("Path must be a string")
    }
    
    let keys = path.split(".");
    let value = obj;
    for (let key of keys) {
        value = value[key]
        if (value == undefined) {
            return undefined
        } 
    }
    return value;
}
