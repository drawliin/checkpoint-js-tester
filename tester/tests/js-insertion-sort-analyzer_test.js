Math.insertionSortAnalyzer = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

const ascending = (a, b) => a - b;
const descending = (a, b) => b - a;

// Test cases for insertionSortAnalyzer
t(({ eq }) => {
    const result = insertionSortAnalyzer([5, 2, 4, 6, 1, 3], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 5, 6],
        iterations: 12,
        swaps: 9,
    });
});

t(({ eq }) => {
    const result = insertionSortAnalyzer([3, 1, 4, 1, 5, 9], ascending);
    return eq(result, {
        sortedArray: [1, 1, 3, 4, 5, 9],
        iterations: 7,
        swaps: 3,
    });
});

t(({ eq }) => {
    const result = insertionSortAnalyzer([1, 2, 3, 4, 5], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 5],
        iterations: 4,
        swaps: 0,
    });
});

t(({ eq }) => {
    const result = insertionSortAnalyzer([5, 4, 3, 2, 1], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 5],
        iterations: 10,
        swaps: 10,
    });
});

t(({ eq }) => {
    const result = insertionSortAnalyzer([5, 2, 4, 6, 1, 3], descending);
    return eq(result, {
        sortedArray: [6, 5, 4, 3, 2, 1],
        iterations: 10,
        swaps: 6,
    });
});

t(({ eq }) => {
    const result = insertionSortAnalyzer([], ascending);
    return eq(result, {
        sortedArray: [],
        iterations: 0,
        swaps: 0,
    });
});

Object.freeze(tests);