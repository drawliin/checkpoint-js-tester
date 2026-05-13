Math.deepFreeze = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// **Helper function to check if an object is fully frozen**
const isDeepFrozen = (obj) => {
  if (!Object.isFrozen(obj)) return false;
  return Object.keys(obj).every(
    (key) =>
      typeof obj[key] !== "object" ||
      obj[key] === null ||
      (Object.isFrozen(obj[key]) && isDeepFrozen(obj[key])),
  );
};

// **Helper function to catch errors**
const throwsError = (fn, errorMsg) => {
  try {
    fn();
  } catch (error) {
    return error.message === errorMsg;
  }
  return false;
};

// **Test: Throws Error for Non-Objects**
t(({ eq }) =>
  eq(
    throwsError(() => deepFreeze(42), "Input must be a non-null object"),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(() => deepFreeze("hello"), "Input must be a non-null object"),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(() => deepFreeze(null), "Input must be a non-null object"),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(() => deepFreeze(undefined), "Input must be a non-null object"),
    true,
  ),
);

// **Test: Freezes Simple Objects**
t(({ eq }) => {
  const obj = { a: 1, b: "test" };
  deepFreeze(obj);
  return eq(Object.isFrozen(obj), true);
});

// **Test: Freezes Nested Objects**
t(({ eq }) => {
  const obj = { a: { b: { c: 5 } }, d: 10 };
  deepFreeze(obj);
  return eq(isDeepFrozen(obj), true);
});

// **Test: Freezes Objects with Arrays**
t(({ eq }) => {
  const obj = { list: [1, 2, 3] };
  deepFreeze(obj);
  return eq(isDeepFrozen(obj), true);
});

// **Test: Prevents Modification**
t(({ eq }) => {
  const obj = { key: "value" };
  deepFreeze(obj);
  try {
    obj.key = "newValue";
  } catch (e) {
    return true; // Should throw an error in strict mode
  }
  return obj.key === "value"; // Should remain unchanged in non-strict mode
});

// **Test: Prevents Adding New Properties**
t(({ eq }) => {
  const obj = { key: "value" };
  deepFreeze(obj);
  try {
    obj.newKey = "newValue";
  } catch (e) {
    return true;
  }
  return !obj.hasOwnProperty("newKey");
});

// **Test: Prevents Deleting Properties**
t(({ eq }) => {
  const obj = { key: "value" };
  deepFreeze(obj);
  try {
    delete obj.key;
  } catch (e) {
    return true;
  }
  return obj.hasOwnProperty("key");
});

// **Test: Prevents Modifying Arrays**
t(({ eq }) => {
  const obj = { list: [1, 2, 3] };
  deepFreeze(obj);
  try {
    obj.list.push(4);
  } catch (e) {
    return true;
  }
  return obj.list.length === 3;
});

// **Test: Handles Circular References**
t(({ eq }) => {
  const obj = { name: "Alice" };
  obj.self = obj;
  deepFreeze(obj);
  return eq(Object.isFrozen(obj) && Object.isFrozen(obj.self), true);
});

Object.freeze(tests);
