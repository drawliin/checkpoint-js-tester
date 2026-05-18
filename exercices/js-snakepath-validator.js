function isSnakePath(grid) {
    const cells = grid.flatMap((row, rowIndex) =>
        row.flatMap((value, columnIndex) =>
            value === 1
                ? [{ row: rowIndex, column: columnIndex, key: `${rowIndex},${columnIndex}` }]
                : []
        )
    );

    if (cells.length === 0) {
        return false;
    }

    const areNeighbors = (cellA, cellB) =>
        Math.abs(cellA.row - cellB.row) + Math.abs(cellA.column - cellB.column) === 1;

    const visited = Array.from({ length: cells.length }).reduce(
        (seen) =>
            new Set([
                ...seen,
                ...cells
                    .filter((cell) =>
                        cells.some((otherCell) => seen.has(otherCell.key) && areNeighbors(cell, otherCell))
                    )
                    .map((cell) => cell.key),
            ]),
        new Set([cells[0].key])
    );

    return visited.size === cells.length;
}
