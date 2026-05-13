Math.swappableObject = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// **Helper function to catch errors**
const throwsError = (fn, errorMsg) => {
  try {
    fn();
  } catch (error) {
    return error.message === errorMsg;
  }
  return false;
};

// **Test: Basic Key-Value and Value-Key Lookups**
t(({ eq }) => {
  const obj = swappableObject({ a: "apple", b: "banana" });
  return (
    eq(obj.a, "apple") &&
    eq(obj.apple, "a") &&
    eq(obj.b, "banana") &&
    eq(obj.banana, "b")
  );
});

// **Test: Undefined for Missing Keys or Values**
t(({ eq }) => {
  const obj = swappableObject({ a: "apple" });
  return eq(obj.unknown, undefined) && eq(obj.nonexistent, undefined);
});

// **Test: Supports Dynamic Updates**
t(({ eq }) => {
  const obj = swappableObject({ a: "apple" });
  obj.b = "banana"; // Add dynamically
  return eq(obj.b, "banana") && eq(obj.banana, "b");
});

// **Test: Handles Overwritten Values**
t(({ eq }) => {
  const obj = swappableObject({ a: "apple", b: "banana" });
  obj.b = "cherry"; // Change value
  return (
    eq(obj.b, "cherry") && eq(obj.cherry, "b") && eq(obj.banana, undefined)
  );
});

// **Test: Handles Deletions**
t(({ eq }) => {
  const obj = swappableObject({ a: "apple", b: "banana" });
  delete obj.a;
  return eq(obj.a, undefined) && eq(obj.apple, undefined);
});

Object.freeze(tests);
