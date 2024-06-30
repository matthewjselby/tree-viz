import { TreeLayout } from "@/lib/TreeLayout";

class LLRBTreeNode<T> {
    key: T;
    left?: LLRBTreeNode<T>;
    right?: LLRBTreeNode<T>;
    parent?: LLRBTreeNode<T>;
    tree: LLRBTree<T>;
    isRed: boolean;

    constructor(tree: LLRBTree<T>, key: T) {
        this.tree = tree;
        this.key = key;
        this.isRed = true;
    }

    rotateLeft() {
        if (this.right && this.right.isRed) {
            const y = this.right;
            this.right = y.left;
            if (y.left) {
                y.left.parent = this;
            }
            y.parent = this.parent;
            if (!this.parent) {
                this.tree.root = y;
            } else if (this === this.parent.left) {
                this.parent.left = y;
            } else {
                this.parent.right = y;
            }
            const redTmp = y.isRed;
            y.isRed = this.isRed;
            this.isRed = redTmp;
            y.left = this;
            this.parent = y;
        }
    }

    rotateRight() {
        if (this.left && this.left.isRed) {
            const y = this.left;
            this.left = y.right;
            if (y.right) {
                y.right.parent = this;
            }
            y.parent = this.parent;
            if (!this.parent) {
                this.tree.root = y;
            } else if (this === this.parent.right) {
                this.parent.right = y;
            } else {
                this.parent.left = y;
            }
            const redTmp = y.isRed;
            y.isRed = this.isRed;
            this.isRed = redTmp;
            y.right = this;
            this.parent = y;
        }
    }

    setRed(r: boolean) {
        this.isRed = r;
    }

    flipColors() {
        this.isRed = !this.isRed;
        if (this.left) {
            this.left.isRed = !this.left.isRed;
        }
        if (this.right) {
            this.right.isRed = !this.right.isRed;
        }
    }
};

export class LLRBTree<T> {
    root?: LLRBTreeNode<T>;

    constructor() {

    }

    fix(z: LLRBTreeNode<T>) {
        console.log(`fixing node ${z.key}`);
        if (z.left && z.left.isRed && z.right && z.right.isRed) {
            console.log(`flipping colors for node ${z.key}`);
            z.flipColors();
        }
        if (z.left && z.left.isRed && z.left.left && z.left.left.isRed) {
            console.log(`rotating right on node ${z.key}`);
            z.rotateRight();
        }
        if (z.right && z.right.isRed) {
            console.log(`rotating left on node ${z.key}`);
            z.rotateLeft();
        }
        if (z.parent) {
            console.log(`traversing to parent of ${z.key}`);
            this.fix(z.parent);
        }
    }

    insert(key: T) {
        console.log(`=================== inserting ${key} ===================`);
        const newNode = new LLRBTreeNode<T>(this, key);

        if (this.root) {
            const insertRec = (currentNode: LLRBTreeNode<T>) => {
                if (key < currentNode.key) {
                    if (currentNode.left) {
                        insertRec(currentNode.left);
                    } else {
                        currentNode.left = newNode;
                        newNode.parent = currentNode;
                    }
                } else if (key > currentNode.key) {
                    if (currentNode.right) {
                        insertRec(currentNode.right);
                    } else {
                        currentNode.right = newNode;
                        newNode.parent = currentNode;
                    }
                }
            }
            insertRec(this.root);
            this.fix(newNode);
            this.root.isRed = false;
        } else {
            this.root = newNode;
            this.root.isRed = false;
        }
    }

    print() {
        if (this.root) {
            const traverseTree = (currentNode: LLRBTreeNode<T>, level: number) => {
                console.log(`${currentNode.key} at level ${level} | l: ${currentNode.left?.key} | r: ${currentNode.right?.key} | p: ${currentNode.parent?.key} | isRed: ${currentNode.isRed}`);
                if (currentNode.left) {
                    traverseTree(currentNode.left, level + 1);
                }
                if (currentNode.right) {
                    traverseTree(currentNode.right, level + 1);
                }
            }
            traverseTree(this.root, 0);
        } else {
            console.log("Empty LLRBTree");
        }
    }

    layout(spacingX: number, spacingY: number, paddingX: number, paddingY: number): TreeLayout {
        if (this.root) {
            const levels: (LLRBTreeNode<T> | undefined)[][] = [];
            const getLevels = (currentNode: LLRBTreeNode<T>, level: number, nodeIdx: number) => {
                if (!levels.at(level)) {
                    levels[level] = [];
                    levels[level].fill(undefined, 0, 2 ** level);
                }
                if (currentNode) {
                    levels[level][nodeIdx] = currentNode;
                    if (currentNode.left) {
                        getLevels(currentNode.left, level + 1, nodeIdx * 2);
                    }
                    if (currentNode.right) {
                        getLevels(currentNode.right, level + 1, nodeIdx * 2 + 1);
                    }
                }
            }
            getLevels(this.root, 0, 0);
            const numLevels = levels.length;
            let nodes: { keys: string[], posX: number, posY: number }[] = [];
            let edges: { x1: number, x2: number, y1: number, y2: number, isRed: boolean }[] = [];
            const positions: { [key: string]: { posX: number, posY: number } } = {};
            for (let level = 0; level < levels.length; level++) {
                for (let nodeIndex = 0; nodeIndex < levels[level].length; nodeIndex++) {
                    const currentNode = levels.at(level)?.at(nodeIndex);
                    if (currentNode) {
                        const posX = paddingX + (spacingX / 2 * 2 ** (numLevels - level - 1)) + (spacingX * nodeIndex * 2 ** (numLevels - level - 1));
                        const posY = paddingY + spacingY * level;
                        positions[`${currentNode.key}`] = { posX: posX, posY: posY };
                        nodes.push({ keys: [String(currentNode.key)], posX: posX, posY: posY });
                        if (currentNode.parent && positions[`${currentNode.parent.key}`]) {
                            const parentPos = positions[`${currentNode.parent.key}`];
                            edges.push({ x1: posX, x2: parentPos.posX, y1: posY, y2: parentPos.posY, isRed: currentNode.isRed });
                        }
                    }
                }
            }
            return {
                nodes: nodes,
                edges: edges,
                height: (2 * paddingY) + ((numLevels - 1) * spacingY),
                width: (2 * paddingX) + (spacingX * 2 ** (numLevels - 1))
            };
        }
        return {
            nodes: [],
            edges: [],
            height: 0,
            width: 0
        };
    }
}