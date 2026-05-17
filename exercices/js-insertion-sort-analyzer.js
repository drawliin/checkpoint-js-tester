function insertionSortAnalyzer(arr, comparator) {
    const sortedArray = [...arr];
    let iterations = 0;
    let swaps = 0;

    for (let i = 1; i < sortedArray.length; i++) {
        let j = i;

        while (j > 0) {
            iterations++;

            if (comparator(sortedArray[j - 1], sortedArray[j]) <= 0) {
                break;
            }

            [sortedArray[j - 1], sortedArray[j]] = [sortedArray[j], sortedArray[j - 1]];
            swaps++;
            j--;
        }
    }

    return {
        sortedArray,
        iterations,
        swaps,
    };
}
