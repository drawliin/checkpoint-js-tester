Math.evenSum = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for evenSum
t(({ eq }) => eq(evenSum(5), 6));
t(({ eq }) => eq(evenSum(1), 0));
t(({ eq }) => eq(evenSum(0), 0));
t(({ eq }) => eq(evenSum(10), 30));
t(({ eq }) => eq(evenSum(7), 12));
t(({ eq }) => eq(evenSum(-1), 0));

Object.freeze(tests);
