function mergeAndTransform(objects, transforms) {
    let final = {...objects[0]}, transformationsCount = transforms.length, keysAdded = 0, keysOverwritten = 0;

    for (let i = 1; i < objects.length; i++) {
        let obj = objects[i];

        for (let key of Object.keys(obj)) {
            if (final.hasOwnProperty(key)) {
                keysOverwritten++;
                final[key] = obj[key];
                continue;
            }
            final[key] = obj[key];
            keysAdded++
        }
    }

    for (let func of transforms) {
        final = func(final);
    }

    return {
        finalObject: final,
        transformationsCount,
        keysAdded,
        keysOverwritten
    }
}