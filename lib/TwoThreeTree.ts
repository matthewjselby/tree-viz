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

    print() {
        //console.log(`BTreeNode: ${this.keys} | ${this.children.map(child => child.keys)} | ${this.parent?.keys}`);
    }

    split() {
        //console.log(`splitting node ${this.keys} | ${this.children.map(child => child.keys)} | ${this.parent?.keys}`);
        const mid = Math.floor((order + 1) / 2);
        const medianVal = this.keys.at(mid) as T;
        //console.log(`the middle index is: ${mid}`)
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
        //console.log(`Adding ${newKey} into ${this.keys}`);
        let i = 0;
        while (i < this.keys.length && newKey > (this.keys.at(i) as T)) {
            i++;
        }
        this.keys.splice(i, 0, newKey);
        return i;
    }
}

export class BTree<T> {
    root: BTreeNode<T>;

    constructor(rootKey: T) {
        this.root = new BTreeNode<T>(this);
        this.root.addKey(rootKey);
    }

    insert(key: T) {
        //console.log(`Inserting key ${key}`);
        this.root.print();
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
    }

    print() {
        const printRec = (currentNode: BTreeNode<T>, level: number) => {
            //console.log(`${currentNode.keys} at level ${level} | children: ${currentNode.children.map(child => child.keys)} | parent: ${currentNode.parent?.keys}`);
            for (const child of currentNode.children) {
                printRec(child, level + 1);
            }
        }
        printRec(this.root, 1);
    }

    numLevels() {
        let numLevels = 0;
        const traverseTree = (currentNode: BTreeNode<T>, level: number) => {
            if (level > numLevels) { numLevels = level };
            for (const child of currentNode.children) {
                traverseTree(child, level + 1);
            }
        }
        traverseTree(this.root, 1);
        return numLevels;
    }

    layout(spacingX: number, spacingY: number, paddingX: number, paddingY: number) {
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
        let layout: {keys: T[], posX: number, posY: number, parentPos?: {posX: number, posY: number}}[] = [];
        const positions: {[key: string]: {posX: number, posY: number}} = {};
        levels.forEach((level, levelIdx) => {
            const posXMultiplier = levelIdx < numLevels && levels[levelIdx + 1].length % 2 !== 0 ? 1.5 : 1;
            level.forEach((node, nodeIdx) => {
                const posX = (posXMultiplier * 2**(numLevels - levelIdx) + (nodeIdx * 2 * 2**(numLevels - levelIdx)));
                const posY = levelIdx;
                positions[node.keys.join("")] = {posX: posX, posY: posY};
                let parentPos = undefined;
                if (node.parent && positions[node.parent.keys.join("")]) {
                    parentPos = positions[node.parent.keys.join("")];
                }
                layout.push({keys: node.keys, posX: posX, posY: posY, parentPos: parentPos});
            });
        });
        return {
            layout: layout,
            numLevels: numLevels,
            heightUnits: numLevels,
            widthUnits: (levels.at(-1) as BTreeNode<T>[]).length
        };
    }
}

const tree = new BTree(1);
tree.insert(2);
tree.insert(3);
tree.insert(4);
tree.insert(5);
tree.insert(6);
tree.insert(7);
tree.print();