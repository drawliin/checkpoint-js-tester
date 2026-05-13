Math.gridWordFinder2 = undefined;
// /*/ // ⚡
export const tests = [];
const t = (f) => tests.push(f);

const grid = [
  ["c", "a", "t"],
  ["d", "o", "g"],
  ["r", "a", "t"],
];

const grid2 = [
  ["c", "d", "r"],
  ["a", "o", "a"],
  ["t", "g", "t"],
];

t(({ eq }) =>
  eq(gridWordFinder2(grid, "cat"), [{ x: 0, y: 0, direction: "horizontal" }]),
); // Horizontal match at the first row
t(({ eq }) =>
  eq(gridWordFinder2(grid, "dog"), [{ x: 0, y: 1, direction: "horizontal" }]),
); // Another horizontal match at the mid row
t(({ eq }) =>
  eq(gridWordFinder2(grid, "rat"), [{ x: 0, y: 2, direction: "horizontal" }]),
); // Another horizontal match at the last row
t(({ eq }) =>
  eq(gridWordFinder2(grid2, "cat"), [{ x: 0, y: 0, direction: "vertical" }]),
); // Vertical match at the first col
t(({ eq }) =>
  eq(gridWordFinder2(grid2, "dog"), [{ x: 1, y: 0, direction: "vertical" }]),
); // Vertical match at the mid col
t(({ eq }) =>
  eq(gridWordFinder2(grid2, "rat"), [{ x: 2, y: 0, direction: "vertical" }]),
); // Vertical match at the last col
t(({ eq }) => eq(gridWordFinder2(grid, "car"), [])); // No match
t(({ eq }) => eq(gridWordFinder2(grid, ""), [])); // No match
Object.freeze(tests);
