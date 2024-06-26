// class BTreeNode<T> {
//     keys: T[];
//     children: BTreeNode<T>[];

//     constructor() {
//         this.keys = [];
//         this.children = [];
//     }
// }

// class BTree<T> {
//     root: BTreeNode<T>;
//     order: number;

//     constructor(order: number) {
//         this.order = order;
//         this.root = new BTreeNode<T>();
//     }

//     splitRoot() {
//         const newRoot = new BTreeNode<T>();
//         newRoot.children.splice(0, 0, this.root);
//         this.root = newRoot;
//         return newRoot;
//     }

//     splitChild(node: BTreeNode<T>, childIndex: number) {
//         const childNode = node.children.at(childIndex) as BTreeNode<T>;
//         const newNode = new BTreeNode<T>();
//         node.children.splice(childIndex + 1, 0, newNode);
//         node.keys.splice(childIndex, 0, (childNode.keys.at(this.order - 1) as T));
//         newNode.keys = childNode.keys.slice(this.order, (this.order * 2) - 1);
//         childNode.keys = childNode.keys.slice(0, this.order - 1);
//         if (childNode.children.length > 0) {
//             newNode.children = childNode.children.slice(this.order, 2 * this.order);
//             childNode.children = childNode.children.slice(0, this.order - 1);
//         }
//         node.children.splice(childIndex + 1, 0, newNode);
//     }

//     insertAtNode(node: BTreeNode<T>, key: T) {
//         let i = node.keys.length - 1;
//         if (node.children.length === 0) {
//             while (i >= 0 && key < (node.keys.at(i) as T)) {
//                 i--;
//             }
//             node.keys.splice(i + 1, 0, key);
//         } else {
//             while (i >= 0 && key < (node.keys.at(i) as T)) {
//                 i--;
//             }
//             i++;
//             if ((node.children.at(i) as BTreeNode<T>).keys.length === (2 * this.order) - 1) {
//                 this.splitChild(node, i);
//                 if (key > node.keys[i]) {
//                     i++;
//                 }
//             }
//             this.insertAtNode(node.children.at(i) as BTreeNode<T>, key);
//         }
//     }

//     insert(key: T) {
//         if (this.root.keys.length === this.order) {
//             const newRoot = new BTreeNode<T>();
//             newRoot.children.push(this.root);
//             this.root = newRoot;
//             this.splitChild(newRoot, 0);
//             this.insertAtNode(newRoot, key);
//         } else {
//             this.insertAtNode(this.root, key);
//         }
//     }
// }

// const tree = new BTree(2);
// tree.insert(1);
// tree.insert(2);
// tree.insert(3);

// console.log(tree);