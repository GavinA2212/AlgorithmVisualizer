export interface GridNode {
    col: number,
    row: number,
    isStart: boolean
    isFinish: boolean,
    distance: number,
    isVisited: boolean,
    isWall: boolean,
    previousNode: GridNode | null,
}