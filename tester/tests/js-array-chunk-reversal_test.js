Math.reverseChunks = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Test cases for reverseChunks
t(({ eq }) => eq(reverseChunks([1, 2, 3, 4, 5, 6, 7], 3), [3, 2, 1, 6, 5, 4, 7])); // Reverse chunks of size 3
t(({ eq }) => eq(reverseChunks([10, 20, 30, 40, 50], 2), [20, 10, 40, 30, 50])); // Reverse chunks of size 2
t(({ eq }) => eq(reverseChunks([1, 2, 3, 4, 5], 4), [4, 3, 2, 1, 5])); // Reverse chunks of size 4
t(({ eq }) => eq(reverseChunks([1, 2, 3, 4, 5], 1), [1, 2, 3, 4, 5])); // Chunks of size 1 (no change)
t(({ eq }) => eq(reverseChunks([1, 2, 3, 4, 5], 10), [5, 4, 3, 2, 1])); // Chunk size larger than array
t(({ eq }) => eq(reverseChunks([], 3), [])); // Empty array

Object.freeze(tests);
