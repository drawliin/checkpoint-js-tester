Math.deepFind = undefined;
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

// **Test: Throws Error for Non-Objects**
t(({ eq }) =>
  eq(
    throwsError(() => deepFind(42, "test"), "Input must be a non-null object"),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(
      () => deepFind("hello", "test"),
      "Input must be a non-null object",
    ),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(
      () => deepFind(null, "test"),
      "Input must be a non-null object",
    ),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(
      () => deepFind(undefined, "test"),
      "Input must be a non-null object",
    ),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(() => deepFind([], "test"), "Input must be a non-null object"),
    true,
  ),
);

// **Test: Throws Error for Invalid Paths**
t(({ eq }) =>
  eq(
    throwsError(() => deepFind({}, 42), "Path must be a string"),
    true,
  ),
);
t(({ eq }) =>
  eq(
    throwsError(() => deepFind({}, null), "Path must be a string"),
    true,
  ),
);

// **Test: Retrieves Values from Nested Objects**
t(({ eq }) => {
  const obj = {
    user: {
      profile: {
        name: "Alice",
        details: {
          age: 25,
          hobbies: ["reading", "gaming"],
        },
      },
    },
  };
  return eq(deepFind(obj, "user.profile.name"), "Alice");
});

t(({ eq }) => {
  const obj = {
    user: {
      profile: {
        name: "Alice",
        details: {
          age: 25,
          hobbies: ["reading", "gaming"],
        },
      },
    },
  };
  return eq(deepFind(obj, "user.profile.details.age"), 25);
});

// **Test: Retrieves Values from Arrays in Objects**
t(({ eq }) => {
  const obj = {
    user: {
      profile: {
        name: "Alice",
        details: {
          age: 25,
          hobbies: ["reading", "gaming"],
        },
      },
    },
  };
  return eq(deepFind(obj, "user.profile.details.hobbies.1"), "gaming");
});

// **Test: Returns Undefined for Non-Existent Paths**
t(({ eq }) => {
  const obj = {
    user: {
      profile: {
        name: "Alice",
        details: {
          age: 25,
          hobbies: ["reading", "gaming"],
        },
      },
    },
  };
  return eq(deepFind(obj, "user.profile.address.city"), undefined);
});

t(({ eq }) => {
  const obj = {
    user: {
      profile: {
        name: "Alice",
        details: {
          age: 25,
          hobbies: ["reading", "gaming"],
        },
      },
    },
  };
  return eq(deepFind(obj, "user.nonexistent.field"), undefined);
});

// **Test: Works with Deeply Nested Structures**
t(({ eq }) => {
  const obj = {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: "final",
            },
          },
        },
      },
    },
  };
  return eq(deepFind(obj, "a.b.c.d.e.f"), "final");
});

Object.freeze(tests);
