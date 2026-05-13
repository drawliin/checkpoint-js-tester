export const tests = [];
const t = (f) => tests.push(f);

t(({ eq }) => {
    const functions = [
        (val) => val + 2,
        (val) => val * 3,
        (val) => val - 5,
    ];

    const result = pipeline(5, functions);

    return eq(result, {
        finalValue: 16,
        steps: [
            { index: 0, input: 5, output: 7 },
            { index: 1, input: 7, output: 21 },
            { index: 2, input: 21, output: 16 },
        ],
    });
});

t(({ eq }) => {
    const functions = [
        (val) => `Hello, ${val}!`,
        (val) => val.toUpperCase(),
    ];

    const result = pipeline("world", functions);

    return eq(result, {
        finalValue: "HELLO, WORLD!",
        steps: [
            { index: 0, input: "world", output: "Hello, world!" },
            { index: 1, input: "Hello, world!", output: "HELLO, WORLD!" },
        ],
    });
});

t(({ eq }) => {
    const functions = [];
    const result = pipeline(42, functions);

    return eq(result, {
        finalValue: 42,
        steps: [],
    });
});

t(({ eq }) => {
    const functions = [
        (val) => val + 10,
    ];

    const result = pipeline(0, functions);

    return eq(result, {
        finalValue: 10,
        steps: [
            { index: 0, input: 0, output: 10 },
        ],
    });
});

Object.freeze(tests);
