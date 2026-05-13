Math.deepEqual = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// **Helper function to catch errors**
const throwsError = (fn) => {
  try {
    fn();
    return false;
  } catch (error) {
    return error.message === "Input must be a non-null object";
  }
};

// **Test: Throws Error for Non-Objects**
// t(({ eq }) => eq(throwsError(() => deepEqual(42, 42)), true));
// t(({ eq }) => eq(throwsError(() => deepEqual("hello", "hello")), true));
// t(({ eq }) => eq(throwsError(() => deepEqual(null, null)), true));
// t(({ eq }) => eq(throwsError(() => deepEqual(undefined, undefined)), true));
// t(({ eq }) => eq(throwsError(() => deepEqual([], [])), true)); // Arrays not allowed

// **Test: Simple Objects**
t(({ eq }) => {
  const obj1 = { a: 1, b: "test", c: null };
  const obj2 = { a: 1, b: "test", c: null };
  return eq(deepEqual(obj1, obj2), true);
});

// **Test: Nested Objects**
t(({ eq }) => {
  const obj1 = { a: { b: { c: 5 } }, d: 10 };
  const obj2 = { a: { b: { c: 5 } }, d: 10 };
  return eq(deepEqual(obj1, obj2), true);
});

// **Test: Different Nested Objects**
t(({ eq }) => {
  const obj1 = { a: { b: { c: 5 } }, d: 10 };
  const obj2 = { a: { b: { c: 99 } }, d: 10 };
  return eq(deepEqual(obj1, obj2), false);
});

// **Test: Circular References**
t(({ eq }) => {
  const obj1 = { name: "Alice" };
  obj1.self = obj1;
  const obj2 = { name: "Alice" };
  obj2.self = obj1;
  return eq(deepEqual(obj1, obj2), true);
});

// **Test: Circular References**
t(({ eq }) => {
  const obj1 = { name: "Alice" };
  obj1.self = obj1;
  const obj2 = { name: "Alice" };
  obj2.self = obj2;
  return eq(deepEqual(obj1, obj2), false);
});

// **Test: Different Circular References**
t(({ eq }) => {
  const obj1 = { name: "Alice" };
  obj1.self = obj1;
  const obj2 = { name: "Alice" };
  obj2.self = {};
  return eq(deepEqual(obj1, obj2), false);
});

// **Test: Empty Objects**
t(({ eq }) => eq(deepEqual({}, {}), true));

// **Test: Objects with Functions (Functions should not be deeply compared)**
t(({ eq }) => {
  const obj1 = {
    fn: function () {
      return "test";
    },
  };
  const obj2 = {
    fn: function () {
      return "test";
    },
  };
  return eq(deepEqual(obj1, obj2), false); // Functions are not equal by reference
});

// **Test: Objects with Date (Date should be compared correctly)**
t(({ eq }) => {
  const date1 = new Date(2022, 5, 1);
  const date2 = new Date(2022, 5, 1);
  return eq(deepEqual({ date: date1 }, { date: date2 }), true);
});

// **Test: Objects with Symbols**
t(({ eq }) => {
  const sym = Symbol("unique");
  const obj1 = { key: sym };
  const obj2 = { key: sym };
  return eq(deepEqual(obj1, obj2), true);
});

// **Test: Different Symbols**
t(({ eq }) => {
  const obj1 = { key: Symbol("unique") };
  const obj2 = { key: Symbol("unique") };
  return eq(deepEqual(obj1, obj2), false); // Symbols are unique
});

// **Test: Objects with Maps & Sets**
t(({ eq }) => {
  const obj1 = { map: new Map([["key", "value"]]), set: new Set([1, 2, 3]) };
  const obj2 = { map: new Map([["key", "value"]]), set: new Set([1, 2, 3]) };
  return eq(deepEqual(obj1, obj2), true);
});

Object.freeze(tests);
