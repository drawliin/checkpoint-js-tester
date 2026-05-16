// function helper(n, map) {
//     if (n < 2) {
//         return n
//     }
//     if (map[n]) {
//         return map[n];
//     }
//     map[n] = helper(n-2, map) + helper(n-1, map)
//     return map[n]

// }

// function fibonacci(n) {
//     const map = {};
//     return helper(n, map);
// }



function fibonacci(n) {
    if (n < 2) {
        return n
    }
    return fibonacci(n - 2) + fibonacci(n - 1)
}