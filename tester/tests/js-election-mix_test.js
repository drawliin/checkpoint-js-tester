Math.createCurriedFilterAndMap = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// Test cases
t(({ eq }) => {
    const isNumber = (key, value) => typeof value === 'number';
    const double = (val) => val * 2;

    const filterAndDoubleNumbers = createCurriedFilterAndMap(isNumber, double);

    const input = { a: 10, b: 'text', c: 15, d: false };
    const result = filterAndDoubleNumbers(input);

    return eq(result, {
        filteredObject: { a: 20, c: 30 },
        keysKept: 2,
        keysFilteredOut: 2,
    });
});

t(({ eq }) => {
    const isTruthy = (key, value) => !!value;
    const identity = (val) => val;

    const filterTruthyValues = createCurriedFilterAndMap(isTruthy, identity);

    const input = { x: 0, y: true, z: 'hello', w: null };
    const result = filterTruthyValues(input);

    return eq(result, {
        filteredObject: { y: true, z: 'hello' },
        keysKept: 2,
        keysFilteredOut: 2,
    });
});

t(({ eq }) => {
    const isStringKey = (key) => key.startsWith('a');
    const toUpperCase = (val) => (typeof val === 'string' ? val.toUpperCase() : val);

    const filterAndUppercase = createCurriedFilterAndMap(isStringKey, toUpperCase);

    const input = { a1: 'apple', a2: 'banana', b1: 'carrot' };
    const result = filterAndUppercase(input);

    return eq(result, {
        filteredObject: { a1: 'APPLE', a2: 'BANANA' },
        keysKept: 2,
        keysFilteredOut: 1,
    });
});

t(({ eq }) => {
    const alwaysTrue = () => true;
    const identity = (val) => val;

    const keepEverything = createCurriedFilterAndMap(alwaysTrue, identity);

    const input = { name: 'Eve', score: 42 };
    const result = keepEverything(input);

    return eq(result, {
        filteredObject: { name: 'Eve', score: 42 },
        keysKept: 2,
        keysFilteredOut: 0,
    });
});

t(({ eq }) => {
    const alwaysFalse = () => false;
    const identity = (val) => val;

    const keepNothing = createCurriedFilterAndMap(alwaysFalse, identity);

    const input = { name: 'Eve', score: 42 };
    const result = keepNothing(input);

    return eq(result, {
        filteredObject: {},
        keysKept: 0,
        keysFilteredOut: 2,
    });
});

Object.freeze(tests);
