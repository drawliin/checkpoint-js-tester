Math.nestedArrayReverser = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

// Test cases
t(({ eq }) =>
  eq(
    nestedArrayReverser([
      ["hello", "world"],
      ["this", "is"],
      ["a", "test"],
    ]),
    "test a is this world hello",
  ),
); // Basic example
t(({ eq }) =>
  eq(
    nestedArrayReverser([["one"], ["two", "three"], ["four", "five", "six"]]),
    "six five four three two one",
  ),
); // Different lengths
t(({ eq }) => eq(nestedArrayReverser([["a", "b", "c"]]), "c b a")); // Single inner array
t(({ eq }) => eq(nestedArrayReverser([[]]), "")); // Empty inner array
t(({ eq }) => eq(nestedArrayReverser([]), "")); // Completely empty array

Object.freeze(tests);
