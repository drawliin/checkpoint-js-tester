function gridWordFinder2(grid, word) {
    if (word === "" || grid.length === 0) {
        return [];
    }

    const horizontal = grid
        .map((row, y) => {
            if (row.join("") === word) {
                return { x: 0, y: y, direction: "horizontal" };
            }
        })
        .filter(Boolean);

    const transposedGrid = grid[0].map((_, x) => {
        return grid.map((row) => row[x]);
    });

    const vertical = transposedGrid
        .map((row, y) => {
            if (row.join("") === word) {
                return { x: y, y: 0, direction: "vertical" };
            }
        })
        .filter(Boolean);

    return horizontal.concat(vertical);
}
