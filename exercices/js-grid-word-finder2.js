function gridWordFinder2(grid, word) {
    if (word === "" || grid.length === 0) {
        return [];
    }

    const horizontal = grid
        .map((row, y) => {
            if (row.join("").includes(word)) {
                let axisX = row.join("").indexOf(word);
                return { x: axisX, y: y, direction: "horizontal" };
            }
        })
        .filter(Boolean);

    const transposedGrid = grid[0].map((_, x) => {
        return grid.map((row) => row[x]);
    });

    const vertical = transposedGrid
        .map((row, y) => {
            if (row.join("").includes(word)) {
                let axisY = row.join("").indexOf(word);
                return { x: y, y: axisY, direction: "vertical" };
            }
        })
        .filter(Boolean);

    return horizontal.concat(vertical);
}