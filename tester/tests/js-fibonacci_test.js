Math.fibonacci = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for Fibonacci
t(({ eq }) => eq(fibonacci(0), 0)); // Fibonacci of 0
t(({ eq }) => eq(fibonacci(1), 1)); // Fibonacci of 1
t(({ eq }) => eq(fibonacci(2), 1)); // Fibonacci of 2
t(({ eq }) => eq(fibonacci(3), 2)); // Fibonacci of 3
t(({ eq }) => eq(fibonacci(6), 8)); // Fibonacci of 6
t(({ eq }) => eq(fibonacci(10), 55)); // Fibonacci of 10

Object.freeze(tests);
