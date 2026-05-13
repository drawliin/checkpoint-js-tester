Math.flattenAndMap = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

t(({ eq }) => {
    const obj = {
        a: { b: 2, c: { d: 4 } },
        e: 5,
    };
    const mapper = (x) => x * 2;
    const result = flattenAndMap(obj, mapper);

    return eq(result, {
        flattened: { "a.b": 4, "a.c.d": 8, e: 10 },
        originalKeysCount: 3,
        transformedKeysCount: 3,
    });
});

t(({ eq }) => {
    const obj = {
        nested: { key: "value", arr: [1, 2, 3] },
    };
    const mapper = (x) => (typeof x === "string" ? x.toUpperCase() : x + 1);
    const result = flattenAndMap(obj, mapper);

    return eq(result, {
        flattened: {
            "nested.key": "VALUE",
            "nested.arr": [2, 3, 4],
        },
        originalKeysCount: 2,
        transformedKeysCount: 2,
    });
});

t(({ eq }) => {
    const obj = {};
    const result = flattenAndMap(obj, (x) => x);

    return eq(result, {
        flattened: {},
        originalKeysCount: 0,
        transformedKeysCount: 0,
    });
});

Object.freeze(tests);
