import { TreeLayout } from "@/lib/TreeLayout";

const order = 2;

export class BTreeNode<T> {
    keys: T[];
    children: BTreeNode<T>[];
    tree: BTree<T>;
    parent?: BTreeNode<T>;

    constructor(tree: BTree<T>) {
        this.tree = tree;
        this.keys = [];
        this.children = [];
    }

    split() {
        const mid = Math.floor((order + 1) / 2);
        const medianVal = this.keys.at(mid) as T;
        // create a new node (splitting), which will include the upper keys and children
        const newRight = new BTreeNode<T>(this.tree);
        newRight.keys = this.keys.slice(mid + 1);
        newRight.children = this.children.slice(mid + 1);
        for (const child of newRight.children) {
            child.parent = newRight;
        }
        // remove the upper keys and children from the current node
        this.keys = this.keys.slice(0, mid);
        this.children = this.children.slice(0, mid + 1);
        // incorporate back into tree
        if (this.parent) { // case where we are not splitting the root
            const newKeyIdx = this.parent.addKey(medianVal);
            this.parent.children.splice(newKeyIdx + 1, 0, newRight);
            newRight.parent = this.parent;
            if (this.parent.keys.length > order) {
                this.parent.split();
            }
        } else { // case where we are splitting the root
            const newRoot = new BTreeNode<T>(this.tree);
            newRoot.addKey(medianVal);
            newRoot.children = [this, newRight];
            this.parent = newRoot;
            newRight.parent = newRoot;
            this.tree.root = newRoot;
        }
    }

    addKey(newKey: T) {
        // adds a new key to the node
        let i = 0;
        while (i < this.keys.length && newKey > (this.keys.at(i) as T)) {
            i++;
        }
        if (newKey !== this.keys.at(i)) {
            this.keys.splice(i, 0, newKey);
        }
        return i;
    }
}

export class BTree<T> {
    root?: BTreeNode<T>;

    constructor() {
        // create an empty tree
    }

    insert(key: T) {
        if (this.root) {
            const insertRec = (currentNode: BTreeNode<T>, key: T) => {
                if (currentNode.children.length !== 0) {
                    let i = 0;
                    while (i < currentNode.keys.length && key > (currentNode.keys.at(i) as T)) {
                        i++;
                    }
                    insertRec(currentNode.children.at(i) as BTreeNode<T>, key);
                } else {
                    currentNode.addKey(key);
                    if (currentNode.keys.length > order) {
                        currentNode.split();
                    }
                }
            }
            insertRec(this.root, key);
        } else {
            this.root = new BTreeNode<T>(this);
            this.root.addKey(key);
        }
    }

    print() {
        if (this.root) {
            const printRec = (currentNode: BTreeNode<T>, level: number) => {
                console.log(`${currentNode.keys} at level ${level} | children: ${currentNode.children.map(child => child.keys)} | parent: ${currentNode.parent?.keys ?? "none"}`);
                for (const child of currentNode.children) {
                    printRec(child, level + 1);
                }
            }
            printRec(this.root, 1);
        } else {
            console.log("Empty BTree");
        }
    }

    layout(spacingX: number, spacingY: number, paddingX: number, paddingY: number): TreeLayout {
        if (this.root) {
            let levels: BTreeNode<T>[][] = [];
            let numLevels = 0;
            let getLevels = (currentNode: BTreeNode<T>, level: number) => {
                if (level > numLevels) { numLevels = level };
                if (levels.at(level)) {
                    levels[level].push(currentNode);
                } else {
                    levels[level] = [currentNode];
                }
                for (const child of currentNode.children) {
                    getLevels(child, level + 1);
                }
            }
            getLevels(this.root, 0);
            let nodes: { keys: string[], posX: number, posY: number }[] = [];
            let edges: { x1: number, x2: number, y1: number, y2: number, isRed: boolean }[] = [];
            const positions: { [key: string]: { posX: number, posY: number } } = {};
            for (let i = levels.length - 1; i >= 0; i--) {
                for (let j = 0; j < levels[i].length; j++) {
                    const node = levels[i][j];
                    const posY = paddingY + spacingY * i;
                    if (node.children.length === 0) { // lay out leaf node
                        const posX = paddingX + (spacingX * j);
                        positions[node.keys.join("")] = { posX: posX, posY: posY };
                        nodes.push({ keys: node.keys.map(key => String(key)), posX: posX, posY: posY });
                    } else { // lay out non-leaf node
                        let centerX = 0; // calculate the position of the parent node as the center of the child nodes
                        const edgesTo: { posX: number, posY: number }[] = [];
                        for (const child of node.children) {
                            const childPosition = positions[child.keys.join("")];
                            edgesTo.push(childPosition);
                            centerX += childPosition.posX;
                        }
                        centerX = (centerX / edgesTo.length);
                        positions[node.keys.join("")] = { posX: centerX, posY: posY };
                        nodes.push({ keys: node.keys.map(key => String(key)), posX: centerX, posY: posY });
                        edges.push(...edgesTo.map(edge => { return { x1: centerX, x2: edge.posX, y1: posY, y2: edge.posY, isRed: false } }));
                    }
                }
            }
            return {
                nodes: nodes,
                edges: edges,
                height: (2 * paddingY) + (numLevels * spacingY),
                width: (2 * paddingX) + (((levels.at(-1) as BTreeNode<T>[]).length - 1) * spacingX)
            };
        } else {
            return {
                nodes: [],
                edges: [],
                height: 0,
                width: 0
            }
        }
    }
}