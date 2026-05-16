function divisors(n) {
    const arr = []
    if (n < 0) {
        n *= -1;
    }
    for (let i = 1; i < n; i++) {
        if (n % i === 0) {
            arr.push(i);
        }
    }
    return arr
}
