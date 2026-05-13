Math.deepClone = undefined;
delete globalThis.structuredClone;

// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// **Helper function to check deep equality**
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true; // Same reference
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  )
    return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

// **Test: Simple Objects**
t(({ eq }) => {
  const obj = { a: 1, b: "test", c: null };
  const clone = deepClone(obj);
  return deepEqual(clone, obj) && clone !== obj;
});

// **Test: Nested Objects**
t(({ eq }) => {
  const obj = { a: { b: { c: 5 } }, d: 10 };
  const clone = deepClone(obj);
  clone.a.b.c = 99;
  return !deepEqual(clone, obj); // Modification shouldn't affect original
});

// **Test: Circular References**
t(({ eq }) => {
  const obj = { name: "Alice" };
  obj.self = obj;
  const clone = deepClone(obj);
  return clone !== obj && clone.self === clone; // Circular ref is maintained in clone
});

// **Test: Empty Objects**
t(({ eq }) => deepEqual(deepClone({}), {}));

// **Test: Objects with Functions (Functions should not be cloned, but referenced)**
t(({ eq }) => {
  const obj = {
    fn: function () {
      return "test";
    },
  };
  const clone = deepClone(obj);
  return typeof clone.fn === "function" && clone.fn === obj.fn; // Functions should not be deep cloned
});

// **Test: Objects with Symbols**
t(({ eq }) => {
  const sym = Symbol("unique");
  const obj = { key: sym };
  const clone = deepClone(obj);
  return clone.key === obj.key; // Symbols should be copied as references
});

Object.freeze(tests);
