import { GridNode } from "../interfaces/GridNode";

export function getVisitedBFSNodes(grid: GridNode[][], start: GridNode, end: GridNode) {
    return helper(grid, start, end);
}

function helper(grid: GridNode[][], start: GridNode, end: GridNode) {

    let queue: number[][] = [];
    queue.push([start.row, start.col]);
    start.isVisited = true;
    let visitedInOrder: number[][] = [];

    while (queue.length != 0) {
        const n = queue.length;
        for (let i = 0; i < n; i++) {
            const pop = queue.shift();
            if (!pop) break;
            if (pop[0] == end.row && pop[1] == end.col) return visitedInOrder;
            const neighbors = getNeighbors(pop[0], pop[1], grid);
            for (let j = 0; j < neighbors.length; j++) {
                const n = grid[neighbors[j][0]][neighbors[j][1]];
                if (!n.isVisited && !n.isWall && !n.isStart) {
                    n.isVisited = true;
                    n.previousNode = grid[pop[0]][pop[1]];
                    visitedInOrder.push([n.row, n.col]);
                    queue.push([n.row, n.col]);
                }
            }
        }
    }
    return visitedInOrder;
}

function getNeighbors(row: number, col: number, grid: GridNode[][]) {
    let result: number[][] = [];
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];

    for (let i = 0; i < dx.length; i++) {
        const newX = row + dx[i];
        const newY = col + dy[i];
        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
            result.push([newX, newY]);
        }
    }
    return result;
}