Math.FinalAttempt = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async () => {
    attempts++;
    if (attempts === 2) return "Success";
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt();
  return eq(result, "Success");
});

t(async ({ eq }) => {
  const mockCallback = async () => {
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt();
  return eq(result, "Final Attempt Fail");
});

t(async ({ eq }) => {
  const mockCallback = async (value) => {
    if (value === "test") return `Success with ${value}`;
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 2);
  const result = await finalAttempt("test");
  return eq(result, "Success with test");
});

// Test: Handles a successful attempt on the first try
t(async ({ eq }) => {
  const mockCallback = async (x, y) => x + y;
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt(5, 10);
  return eq(result, 15);
});

// Test: Retries and succeeds after a failure
t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async (x, y) => {
    attempts++;
    if (attempts === 2) return x * y;
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt(3, 4);
  return eq(result, 12);
});

// Test: Exceeds max retries and returns "Final Attempt Fail"
t(async ({ eq }) => {
  const mockCallback = async () => {
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt();
  return eq(result, "Final Attempt Fail");
});

// Test: Works with functions that require multiple parameters
t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async (...args) => {
    attempts++;
    if (attempts === 3) return args.reduce((sum, num) => sum + num, 0);
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 5);
  const result = await finalAttempt(1, 2, 3, 4, 5);
  return eq(result, 15);
});

// Test: Works with async functions that return strings
t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async (name) => {
    attempts++;
    if (attempts >= 2) return `Hello, ${name}!`;
    throw new Error("Error Occurred");
  };
  const finalAttempt = FinalAttempt(mockCallback, 4);
  const result = await finalAttempt("Alice");
  return eq(result, "Hello, Alice!");
});

// Test: Ensures it retries for different types of errors
t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async () => {
    attempts++;
    if (attempts === 4) return "Success!";
    if (attempts % 2 === 0) throw new TypeError("Type Error");
    throw new SyntaxError("Syntax Error");
  };
  const finalAttempt = FinalAttempt(mockCallback, 5);
  const result = await finalAttempt();
  return eq(result, "Success!");
});

// Test: Works with zero parameters
t(async ({ eq }) => {
  let attempts = 0;
  const mockCallback = async () => {
    attempts++;
    if (attempts === 2) return "No Params Success";
    throw new Error("Failure");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt();
  return eq(result, "No Params Success");
});

// Test: Fails even after retries for multiple parameters
t(async ({ eq }) => {
  const mockCallback = async (x, y, z) => {
    throw new Error("Always Fails");
  };
  const finalAttempt = FinalAttempt(mockCallback, 3);
  const result = await finalAttempt(5, 10, 15);
  return eq(result, "Final Attempt Fail");
});

Object.freeze(tests);
