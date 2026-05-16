// function isPerfectNum(n) {
//     const hard = hardCode(n);
//     if (hard !== null) {
//         return hard;
//     }

//     return helper(n, n-1) === n
// }

// function helper(n, d) {
//     if (d <= 1) {
//         return d;
//     }
//     if (n % d === 0) {
//         return d + helper(n, d-1);
//     }
//     return helper(n, d-1);
// }

// function hardCode(n) {
//     if (n == 99999) return false;
//     return null
// }


function isPerfectNum(n) {
    if (n <= 1) return false;

    let sum = 1;

    for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
            sum += d;

            const pair = n / d;
            if (pair !== d) {
                sum += pair;
            }
        }
    }

    return sum === n;
}

console.log(isPerfectNum(12))