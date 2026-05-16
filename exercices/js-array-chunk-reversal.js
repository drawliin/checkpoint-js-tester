function reverseChunks(arr, chunkSize) {
    if (chunkSize === 0) {
        return 0;
    }
    let res = [];
    let i = 0;
    while (i < arr.length) {
        if (i+chunkSize <= arr.length) {
            let chunk = arr.slice(i, i+chunkSize).reverse()
            res.push(...chunk);
            i += chunkSize;
            continue;
        }
        let chunk = arr.slice(i).reverse()
        res.push(...chunk);
        i+=chunkSize
    }
    return res;
}

