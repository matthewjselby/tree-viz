"use client"

import { BTreeGraphNode } from "@/components/BTreeGraphNode";
import { BTreeNode, BTree } from "@/lib/TwoThreeTree";

export const BTreeGraph = () => {

    const spacingX = 40;
    const spacingY = 60;
    const offsetY = 20;
    let tree = new BTree(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    tree.insert(6);
    tree.insert(7);
    tree.insert(8);
    tree.insert(9);

    const treeLayout = tree.layout();
    const nodeLayouts = treeLayout.layout;
    const svgHeight = treeLayout.heightUnits * spacingY + (2 * offsetY);
    const svgWidth = treeLayout.widthUnits * spacingX * 2;

    return (
        <div>
            <svg
                height={svgHeight}
                width={svgWidth}
            >
                {nodeLayouts.map(layout => {
                    if (layout.parentPos) {
                        return <line key={`${layout.posX}${layout.posY}`} x1={spacingX * layout.posX} x2={spacingX * layout.parentPos.posX} y1={spacingY * layout.posY + offsetY} y2={spacingY * layout.parentPos.posY + offsetY} stroke="white" />
                    } else {
                        return <></>
                    }
                })}
                {nodeLayouts.map(layout => {
                    return <BTreeGraphNode key={layout.keys.join("")} vals={layout.keys} pos={{x: spacingX * layout.posX, y: spacingY * layout.posY + offsetY}} />
                })}
            </svg>
        </div>
    );
}