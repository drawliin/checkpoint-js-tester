Math.factorial = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for factorial
t(({ eq }) => eq(factorial(0), 1)); // Factorial of 0
t(({ eq }) => eq(factorial(1), 1)); // Factorial of 1
t(({ eq }) => eq(factorial(5), 120)); // Factorial of 5
t(({ eq }) => eq(factorial(6), 720)); // Factorial of 6
t(({ eq }) => eq(factorial(10), 3628800)); // Factorial of 10

Object.freeze(tests);
