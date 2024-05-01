import "./Node.css";

interface Props {
    col: number,
    isStart: boolean,
    isFinish: boolean,
    isWall: boolean,
    onMouseDown: any,
    onMouseUp: any,
    onMouseEnter: any,
    row: number,
    mouseIsPressed: boolean,
    isVisited: boolean
}

export default function Node({ isFinish, isStart, isWall, onMouseDown, onMouseUp, row, col, onMouseEnter }: Props) {

    const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
    return (
        <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={(e: React.MouseEvent) => onMouseDown(e, row, col)}
            onMouseMove={(e) => onMouseEnter(e, row, col)}
            onMouseUp={() => onMouseUp()}></div>
    );
}