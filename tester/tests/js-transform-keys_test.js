Math.transformKeys = undefined;
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

// **Snake case transformation function**
const toSnakeCase = (key) =>
  key
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, "");

// **Test: Throws Error for Non-Objects**
// t(({ eq }) =>
//   eq(
//     throwsError(
//       () => transformKeys(42, toSnakeCase),
//       "Input must be a non-null object",
//     ),
//     true,
//   ),
// );
// t(({ eq }) =>
//   eq(
//     throwsError(
//       () => transformKeys("hello", toSnakeCase),
//       "Input must be a non-null object",
//     ),
//     true,
//   ),
// );
// t(({ eq }) =>
//   eq(
//     throwsError(
//       () => transformKeys(null, toSnakeCase),
//       "Input must be a non-null object",
//     ),
//     true,
//   ),
// );
// t(({ eq }) =>
//   eq(
//     throwsError(
//       () => transformKeys([], toSnakeCase),
//       "Input must be a non-null object",
//     ),
//     true,
//   ),
// );
// t(({ eq }) =>
//   eq(
//     throwsError(
//       () => transformKeys({}, "not_a_function"),
//       "transformFn must be a function",
//     ),
//     true,
//   ),
// );

// **Test: Simple Object Key Transformation**
t(({ eq }) => {
  const obj = { FirstName: "Alice", LastName: "Doe" };
  const expected = { first_name: "Alice", last_name: "Doe" };
  return eq(
    JSON.stringify(transformKeys(obj, toSnakeCase)),
    JSON.stringify(expected)
  );
});

// **Test: Nested Object Transformation**
t(({ eq }) => {
  const obj = {
    FirstName: "Alice",
    Address: {
      StreetName: "Main St",
      ZipCode: 12345,
    },
  };
  const expected = {
    first_name: "Alice",
    address: {
      street_name: "Main St",
      zip_code: 12345,
    },
  };
  return eq(
    JSON.stringify(transformKeys(obj, toSnakeCase)),
    JSON.stringify(expected)
  );
});

// **Test: Object with Mixed Data Types**
t(({ eq }) => {
  const obj = {
    Name: "Test",
    Age: 30,
    Hobbies: ["reading", "gaming"],
  };
  const expected = {
    name: "Test",
    age: 30,
    hobbies: ["reading", "gaming"],
  };
  return eq(
    JSON.stringify(transformKeys(obj, toSnakeCase)),
    JSON.stringify(expected)
  );
});

// **Test: Handles Empty Objects**
t(({ eq }) =>
  eq(JSON.stringify(transformKeys({}, toSnakeCase)), JSON.stringify({}))
);

// **Test: Custom Transformation Function (Uppercase Keys)**
t(({ eq }) => {
  const obj = { firstName: "Alice", lastName: "Doe" };
  const toUpperCase = (key) => key.toUpperCase();
  const expected = { FIRSTNAME: "Alice", LASTNAME: "Doe" };
  return eq(
    JSON.stringify(transformKeys(obj, toUpperCase)),
    JSON.stringify(expected)
  );
});

Object.freeze(tests);
