Math.bubbleSortAnalyzer = undefined;
// /*/ // ⚡
export const tests = [];
const t = f => tests.push(f);

const ascending = (a, b) => a - b;
const descending = (a, b) => b - a;

// Test cases for bubbleSortAnalyzer
t(({ eq }) => {
    const result = bubbleSortAnalyzer([4, 2, 7, 1, 3], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 7],
        iterations: 10,
        swaps: 6,
    });
});

t(({ eq }) => {
    const result = bubbleSortAnalyzer([5, 3, 2, 1, 4], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 5],
        iterations: 10,
        swaps: 7,
    });
});

t(({ eq }) => {
    const result = bubbleSortAnalyzer([1, 2, 3, 4, 5], ascending);
    return eq(result, {
        sortedArray: [1, 2, 3, 4, 5],
        iterations: 4,
        swaps: 0,
    });
});

t(({ eq }) => {
    const result = bubbleSortAnalyzer([4, 2, 7, 1, 3], descending);
    return eq(result, {
        sortedArray: [7, 4, 3, 2, 1],
        iterations: 9,
        swaps: 4,
    });
});

t(({ eq }) => {
    const result = bubbleSortAnalyzer([], ascending);
    return eq(result, {
        sortedArray: [],
        iterations: 0,
        swaps: 0,
    });
});

Object.freeze(tests);
