Math.mergeAndTransform = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

t(({ eq }) => {
  const objects = [{ x: 1 }, { y: 2 }, { x: 3, z: 4 }];
  const transforms = [
    (obj) => ({ ...obj, x: obj.x * 2 }),
    (obj) => ({ ...obj, newKey: "value" }),
  ];
  const result = mergeAndTransform(objects, transforms);

  return eq(result, {
    finalObject: { x: 6, y: 2, z: 4, newKey: "value" },
    transformationsCount: 2,
    keysAdded: 2,
    keysOverwritten: 1,
  });
});

t(({ eq }) => {
  const objects = [{ a: 10 }, { b: 20 }, { c: 30 }];
  const transforms = [(obj) => obj, (obj) => obj];
  const result = mergeAndTransform(objects, transforms);

  return eq(result, {
    finalObject: { a: 10, b: 20, c: 30 },
    transformationsCount: 2,
    keysAdded: 2,
    keysOverwritten: 0,
  });
});

t(({ eq }) => {
  const objects = [
    { a: 1, b: 2 },
    { b: 3, c: 4 },
  ];
  const transforms = [(obj) => ({ ...obj, b: obj.b + 10 })];
  const result = mergeAndTransform(objects, transforms);

  return eq(result, {
    finalObject: { a: 1, b: 13, c: 4 },
    transformationsCount: 1,
    keysAdded: 1,
    keysOverwritten: 1,
  });
});

t(({ eq }) => {
  const objects = [
    { a: 1, b: 2 },
    { b: 2, a:1, c: 4 },
  ];
  const transforms = [(obj) => ({ ...obj, b: obj.b + 10 })];
  const result = mergeAndTransform(objects, transforms);

  return eq(result, {
    finalObject: { a: 1, b: 12, c: 4 },
    transformationsCount: 1,
    keysAdded: 1,
    keysOverwritten: 2,
  });
});

t(({ eq }) => {
  const objects = [{}, {}, {}];
  const transforms = [];
  const result = mergeAndTransform(objects, transforms);

  return eq(result, {
    finalObject: {},
    transformationsCount: 0,
    keysAdded: 0,
    keysOverwritten: 0,
  });
});

Object.freeze(tests);
