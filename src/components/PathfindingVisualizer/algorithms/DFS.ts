import { GridNode } from "../interfaces/GridNode";

export function getVisitedDFSNodes(grid: GridNode[][], start: GridNode, end: GridNode) {
    const visitedNodes: number[][] = [];
    helper(grid, end, start.row, start.col, visitedNodes);
    return visitedNodes;
}

function helper(grid: GridNode[][], target: GridNode, row: number, col: number, visitedNodes: number[][]) {
    if (row === target.row && col === target.col) return true;
    const neighbors = getNeighbors(row, col, grid);
    for (let j = 0; j < neighbors.length; j++) {
        const n = grid[neighbors[j][0]][neighbors[j][1]];
        if (!n.isVisited && !n.isWall && !n.isStart) {
            n.isVisited = true;
            visitedNodes.push([row, col]);
            n.previousNode = grid[row][col];
            const flag = helper(grid, target, n.row, n.col, visitedNodes);
            if (flag) return true;
        }
    }
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