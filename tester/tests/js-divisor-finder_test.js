Math.divisors = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for divisors
t(({ eq }) => eq(divisors(15), [1, 3, 5]));
t(({ eq }) => eq(divisors(28), [1, 2, 4, 7, 14]));
t(({ eq }) => eq(divisors(1), []));
t(({ eq }) => eq(divisors(10), [1, 2, 5]));
t(({ eq }) => eq(divisors(-15), [1, 3, 5]));
t(({ eq }) => eq(divisors(0), []));
t(({ eq }) => eq(divisors(-28), [1, 2, 4, 7, 14]));

Object.freeze(tests);
