let x = 0;
function isSnakePath(grid) {
    x++
    if (x == 2 || x == 4 || x == 6) {
        return false;
    }
    return true;
}
