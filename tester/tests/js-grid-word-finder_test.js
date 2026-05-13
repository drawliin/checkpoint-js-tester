Math.gridWordsFinder = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

// Example grid
const grid = [
    ['c', 'a', 't'],
    ['d', 'o', 'g'],
    ['r', 'a', 't']
];

// Test cases
t(({ eq }) => eq(gridWordsFinder(grid, ["cat", "dog", "rat", "tar", "car"]), ["cat", "dog", "rat"]));
t(({ eq }) => eq(gridWordsFinder(grid, ["cat", "god", "art", "car"]), ["cat"])); // "god" and "art" are not valid
t(({ eq }) => eq(gridWordsFinder(grid, ["rat", "tar"]), ["rat"])); // Check for reversed word
t(({ eq }) => eq(gridWordsFinder(grid, ["cat", "rat", "dog", "car"]), ["cat", "rat", "dog"])); // Valid words only
t(({ eq }) => eq(gridWordsFinder(grid, ["car"]), [])); // Word not present

// Edge cases
t(({ eq }) => eq(gridWordsFinder([], ["cat", "dog"]), [])); // Empty grid
t(({ eq }) => eq(gridWordsFinder([['a']], ["a", "b"]), ["a"])); // Single-letter grid

Object.freeze(tests);
