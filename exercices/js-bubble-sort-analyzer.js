function bubbleSortAnalyzer(arr, comparator) {
    let iterations = 0;
    let swaps = 0;
    const sortedArray = [...arr];

    for (let i = 0; i < sortedArray.length - 1; i++) {
        let swapped = false;

        for (let j = 0; j < sortedArray.length - 1 - i; j++) {
            iterations++;

            if (comparator(sortedArray[j], sortedArray[j + 1]) > 0) {
                [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
                swaps++;
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return {
        sortedArray,
        iterations,
        swaps
    };
}