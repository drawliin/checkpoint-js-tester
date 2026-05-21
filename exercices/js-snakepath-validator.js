function isSnakePath(grid) {
  const ones = grid.flatMap((row, y) =>
    row.flatMap((v, x) => (v ? [[x, y]] : []))
  );

  if (ones.length === 0) return false;

  const visited = new Set();
  const stack = [ones[0]];

  while (stack.length) {
    const [x, y] = stack.pop();
    const key = `${x},${y}`;

    if (visited.has(key)) continue;

    visited.add(key);

    ones
      .filter(([nx, ny]) =>
        Math.abs(nx - x) + Math.abs(ny - y) === 1
      )
      .forEach((p) => {
        if (!visited.has(`${p[0]},${p[1]}`)) {
          stack.push(p);
        }
      });
  }

  return visited.size === ones.length;
}

