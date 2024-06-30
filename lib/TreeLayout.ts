export type TreeLayout = {
    nodes: {keys: string[], posX: number, posY: number}[];
    edges: {x1: number, x2: number, y1: number, y2: number, isRed: boolean}[];
    height: number;
    width: number;
}