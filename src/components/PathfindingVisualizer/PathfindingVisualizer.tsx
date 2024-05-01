import { useEffect, useState } from "react";
import { GridNode } from "./interfaces/GridNode";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { getVisitedBFSNodes } from "./algorithms/BFS";
import { getVisitedDFSNodes } from "./algorithms/DFS";
import { PathfindingAlgorithm } from "./algorithms";

const START_NODE_ROW = 5;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 5;
const FINISH_NODE_COL = 20;

export default function PathfindingVisualizer() {
    const [grid, setGrid] = useState<GridNode[][]>([]);
    const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);
    const [isGrabbingStart, setIsGrabbingStart] = useState<boolean>(false);
    const [isGrabbingFinish, setIsGrabbingFinish] = useState<boolean>(false);
    const [startLocation, setStartLocation] = useState<number[]>([START_NODE_ROW, START_NODE_COL]);
    const [finishLocation, setFinishLocation] = useState<number[]>([FINISH_NODE_ROW, FINISH_NODE_COL]);
    const [isReset, setIsReset] = useState<boolean>(true);
    const [inProgress, setInProgress] = useState<boolean>(false);

    let promises: Promise<unknown>[] = [];

    useEffect(() => {
        setGrid(getInitialGrid());
        window.addEventListener("mouseup", () => {
            setMouseIsPressed(false);
            if (isGrabbingStart) setIsGrabbingStart(false);
            if (isGrabbingFinish) setIsGrabbingFinish(false);
        });
    }, []);

    function getInitialGrid() {
        const grid: GridNode[][] = [];
        for (let row = 0; row < ((window.innerHeight / 1.75) / 40); row++) {
            const currentRow: GridNode[] = [];
            for (let col = 0; col < ((document.getElementsByClassName("grid")[0] as HTMLElement).offsetWidth / 40) - 1; col++) {
                currentRow.push({
                    col,
                    row,
                    isStart: row === startLocation[0] && col === startLocation[1],
                    isFinish: row === finishLocation[0] && col === finishLocation[1],
                    distance: Infinity,
                    isVisited: false,
                    isWall: false,
                    previousNode: null,
                });
            }
            grid.push(currentRow);
        }
        return grid;
    };

    function handleMouseDown(event: React.MouseEvent, row: number, col: number) {
        event.preventDefault()
        if (grid[row][col].isStart) {
            setIsGrabbingStart(true);
            setMouseIsPressed(true);
            return;
        }

        if (grid[row][col].isFinish) {
            setIsGrabbingFinish(true);
            setMouseIsPressed(true);
            return;
        }
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);

    }

    function handleMouseEnter(event: React.MouseEvent, row: number, col: number) {
        event.preventDefault();
        if (!mouseIsPressed) return;
        if (isGrabbingStart) {
            const node = grid[startLocation[0]][startLocation[1]];
            const existingNode = grid[row][col];
            if (existingNode.isFinish) return;
            const newGrid = grid.slice();
            newGrid[startLocation[0]][startLocation[1]] = { ...node, isStart: false };
            newGrid[row][col] = { row, col, isStart: true, isVisited: false, previousNode: null, isFinish: false, distance: Infinity, isWall: false };
            setGrid(newGrid);
            setStartLocation([row, col]);
            return;
        }

        if (isGrabbingFinish) {
            const node = grid[finishLocation[0]][finishLocation[1]];
            const existingNode = grid[row][col];
            if (existingNode.isStart) return;
            const newGrid = grid.slice();
            newGrid[existingNode.row][existingNode.col] = { ...existingNode, isFinish: false };
            newGrid[finishLocation[0]][finishLocation[1]] = { ...node, isFinish: false };
            newGrid[row][col] = { row, col, isFinish: true, isVisited: false, previousNode: null, isStart: false, distance: Infinity, isWall: false };
            setGrid(newGrid);
            setFinishLocation([row, col]);
            return;
        }
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    }

    function handleMouseUp() {
        setMouseIsPressed(false);
        if (isGrabbingStart) setIsGrabbingStart(false);
        if (isGrabbingFinish) setIsGrabbingFinish(false);
    }

    function getNewGridWithWallToggled(grid: GridNode[][], row: number, col: number) {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: true,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }

    function animate(algorithm: PathfindingAlgorithm) {
        let nodes: number[][];
        switch (algorithm) {
            case PathfindingAlgorithm.DFS:
            default:
                nodes = getVisitedDFSNodes(grid, grid[startLocation[0]][startLocation[1]], grid[finishLocation[0]][finishLocation[1]]);
                break;
            case PathfindingAlgorithm.BFS:
                nodes = getVisitedBFSNodes(grid, grid[startLocation[0]][startLocation[1]], grid[finishLocation[0]][finishLocation[1]]);
                break;
        }
        for (let i = 0; i < nodes.length; i++) {
            promises.push(new Promise((resolve, reject) => {
                setTimeout(() => {
                    const node = grid[nodes[i][0]][nodes[i][1]];
                    const element = document.getElementById(`node-${node.row}-${node.col}`);
                    if (element && !node.isFinish)
                        element.className =
                            'node node-visited';
                    resolve(true);
                }, i * 10);
            }));
        }
        return Promise.all(promises);
    }

    function animatePath() {
        let lastNode = grid[finishLocation[0]][finishLocation[1]];
        const pathNodes: GridNode[] = [];
        while (lastNode.previousNode != null) {
            lastNode = lastNode.previousNode;
            if (lastNode.previousNode != null)
                pathNodes.push(lastNode);
        }
        pathNodes.reverse();
        for (let i = 0; i < pathNodes.length; i++) {
            promises.push(new Promise((resolve, reject) => {
                setTimeout(() => {
                    const element = document.getElementById(`node-${pathNodes[i].row}-${pathNodes[i].col}`);
                    if (element)
                        element.className =
                            'node node-path';
                    resolve(true);
                }, i * 15)
            }));

        }
        return Promise.all(promises);
    }

    async function handleClick(pathAlgorithm: PathfindingAlgorithm) {
        setIsReset(false);
        setInProgress(true);
        await animate(pathAlgorithm);
        await animatePath();
        setInProgress(false);
    }

    function resetGrid() {
        setGrid([]);
        setIsReset(true);
        setTimeout(() => {
            setGrid(getInitialGrid());
        }, 15)
    }

    return (<>
        <div className="grid">
            {grid.map((row, rowIdx) => {
                return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const { row, col, isFinish, isStart, isWall, isVisited } = node;
                            return (
                                <Node
                                    key={nodeIdx}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={handleMouseDown}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseUp={() => handleMouseUp()}
                                    row={row}
                                    isVisited={false}
                                ></Node>
                            );
                        })}
                    </div>
                );
            })}
        </div>

        <div id="path-buttons">
            <button disabled={inProgress || !isReset} onClick={() => handleClick(PathfindingAlgorithm.BFS)}>BFS</button>
            <button disabled={inProgress || !isReset} onClick={() => handleClick(PathfindingAlgorithm.DFS)}>DFS</button>
            <button disabled={inProgress} onClick={resetGrid}>Reset Grid</button>
        </div >
    </>)
}


         // document.addEventListener("mouse", (e) => {
        //     console.log(mouseIsPressed)
        //     let parent = document.getElementsByClassName("grid")[0];
        //     let bounds = parent.getBoundingClientRect();
        //     let x = e.clientX - bounds.left;
        //     let y = e.clientY - bounds.top;
        //     x = Math.floor(x / 25);
        //     y = Math.floor(y / 25);
        //     console.log(x + " " + y);
        // })

        // window.addEventListener("mousedown", (e) => {
        //     let parent = document.getElementsByClassName("grid")[0];
        //     let bounds = parent.getBoundingClientRect();
        //     let x = e.clientX - bounds.left;
        //     let y = e.clientY - bounds.top;
        //     x = Math.floor(x / 25);
        //     y = Math.floor(y / 25);
        //     console.log(x + " " + y);

        // })