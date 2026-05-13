Math.isSnakePath = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 0, 0, 0],
            [1, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ]),
        false
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]),
        false
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 0],
            [1, 1],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 0],
            [0, 1],
        ]),
        false
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 1, 1, 1, 1],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1],
            [1],
            [1],
            [1],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ]),
        true
    )
);

t(({ eq }) =>
    eq(
        isSnakePath([
            [1, 1, 1, 1],
            [0, 0, 0, 1],
            [1, 1, 1, 1],
        ]),
        true
    )
);

Object.freeze(tests);
