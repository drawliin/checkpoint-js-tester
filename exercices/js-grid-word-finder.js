// function gridWordsFinder(grid, words) {
//     if (!grid.length || !words.length) {
//         return [];
//     }

//     const foundWords = new Set();

//     for (let i = 0; i < grid.length; i++) {
//         for (let j = 0; j < grid[i].length; j++) {
//             const [wordX, wordY] = getWords(grid, i, j);
//             if (words.includes(wordX)) {
//                 foundWords.add(wordX);
//             }
//             if (words.includes(wordY)) {
//                 foundWords.add(wordY);
//             }
//         }
//     }

//     return words.filter(word => foundWords.has(word));
// }

// function getWords(grid, i, j) {
//     let wordX = grid[i].slice(j).join("");
//     let wordY = "";
//     for (let k = i; k < grid.length; k++) {
//         wordY += grid[k][j];
//     }
//     return [wordX, wordY]
// }


function gridWordsFinder(grid, words) {
    if (!grid.length || !words.length) {
        return [];
    }

    let res = [];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const [wordX, wordY] = getWords(grid, i, j);
            if (words.includes(wordX)) {
                res.push(wordX);
            }
            if (words.includes(wordY)) {
                res.push(wordY);
            }
        }
    }

    return words.filter(word => res.includes(word));
}

function getWords(grid, i, j) {
    let wordX = grid[i].slice(j).join("");
    let wordY = "";
    for (let k = i; k < grid.length; k++) {
        wordY += grid[k][j];
    }
    return [wordX, wordY]
}
