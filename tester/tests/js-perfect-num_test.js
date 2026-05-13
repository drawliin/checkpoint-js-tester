Math.isPerfectNum = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// Test cases for isPerfectNum
t(({ eq }) => eq(isPerfectNum(6), true));
t(({ eq }) => eq(isPerfectNum(28), true));
t(({ eq }) => eq(isPerfectNum(12), false));
t(({ eq }) => eq(isPerfectNum(1), false));
t(({ eq }) => eq(isPerfectNum(496), true));
t(({ eq }) => eq(isPerfectNum(-6), false));
t(({ eq }) => eq(isPerfectNum(0), false));
t(({ eq }) => eq(isPerfectNum(8128), true));
t(({ eq }) => eq(isPerfectNum(99999), false));
t(({ eq }) => eq(isPerfectNum(9), false));

Object.freeze(tests);
