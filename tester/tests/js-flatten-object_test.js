Math.flattenObject = undefined;

// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// **Test: Flattens Simple Objects**
t(({ eq }) => {
  const obj = { a: 1, b: 2 };
  const expected = { a: 1, b: 2 };
  return eq(flattenObject(obj), expected);
});

// **Test: Flattens Nested Objects**
t(({ eq }) => {
  const obj = { a: { b: { c: 5 } }, d: 10 };
  const expected = { "a.b.c": 5, d: 10 };
  return eq(flattenObject(obj), expected);
});

// **Test: Flattens Objects with Arrays**
t(({ eq }) => {
  const obj = { list: [1, 2, { a: 3 }] };
  const expected = { "list.0": 1, "list.1": 2, "list.2.a": 3 };
  return eq(flattenObject(obj), expected);
});

// **Test: Flattens Deeply Nested Objects & Arrays**
t(({ eq }) => {
  const obj = {
    a: 1,
    b: { c: 2, d: { e: 3 } },
    f: [4, 5, { g: 6 }],
  };
  const expected = {
    a: 1,
    "b.c": 2,
    "b.d.e": 3,
    "f.0": 4,
    "f.1": 5,
    "f.2.g": 6,
  };
  return eq(flattenObject(obj), expected);
});

// **Test: Handles Empty Objects**
t(({ eq }) => eq(flattenObject({}), {}));

// **Test: Handles Objects with Mixed Data Types**
t(({ eq }) => {
  const obj = {
    x: "hello",
    y: 42,
    z: {
      a: true,
      b: null,
      c: ["apple", "banana"],
    },
  };
  const expected = {
    x: "hello",
    y: 42,
    "z.a": true,
    "z.b": null,
    "z.c.0": "apple",
    "z.c.1": "banana",
  };
  return eq(flattenObject(obj), expected);
});

Object.freeze(tests);
