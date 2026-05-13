Math.trapObject = undefined;
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

// **Tracking log for function calls**
const createLogger = () => {
  const log = [];
  return {
    fn: (...args) => log.push(args.map((a) => JSON.parse(JSON.stringify(a)))),
    getLogs: () => log,
  };
};

// **Test: Logs Property Access**
t(({ eq }) => {
  const logger = createLogger();
  const obj = trapObject({ name: "Alice" }, logger.fn);
  obj.name; // Access property
  return eq(logger.getLogs(), [["get", "name", "Alice"]]);
});

// **Test: Logs Property Modification**
t(({ eq }) => {
  const logger = createLogger();
  const obj = trapObject({ age: 25 }, logger.fn);
  obj.age = 30; // Modify property
  return eq(logger.getLogs(), [["set", "age", 25, 30]]);
});

// **Test: Logs Multiple Accesses and Modifications**
t(({ eq }) => {
  const logger = createLogger();
  const obj = trapObject({ x: 10, y: 20 }, logger.fn);
  obj.x;
  obj.y = 50;
  obj.x = 99;
  return eq(logger.getLogs(), [
    ["get", "x", 10],
    ["set", "y", 20, 50],
    ["set", "x", 10, 99],
  ]);
});

// **Test: Handles Nested Objects**
t(({ eq }) => {
  const logger = createLogger();
  const obj = trapObject({ user: { name: "Bob", age: 40 } }, logger.fn);
  obj.user.name; // Access nested property
  obj.user.age = 50; // Modify nested property
  return eq(logger.getLogs(), [
    ["get", "user", { name: "Bob", age: 40 }],
    ["get", "name", "Bob"],
    ["get", "user", { name: "Bob", age: 40 }],
    ["set", "age", 40, 50],
  ]);
});

Object.freeze(tests);
