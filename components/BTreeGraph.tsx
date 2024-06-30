"use client"

import { BTreeGraphNode } from "@/components/BTreeGraphNode";
import { TreeLayout } from "@/lib/TreeLayout";
import React, { useRef, useImperativeHandle, forwardRef, ForwardRefRenderFunction } from "react";
import clsx from "clsx";


export type BTreeGraphHandle = {
    downloadSvg: () => void;
}

type BTreeGraphProps = {
    treeLayout: TreeLayout,
    nodeColor: string,
    edgeColor: string,
    textColor: string,
    className?: string
}

const BTreeGraph: ForwardRefRenderFunction<BTreeGraphHandle, BTreeGraphProps>  = ({ treeLayout, nodeColor, edgeColor, textColor, className }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useImperativeHandle(ref, () => {
        return {
            downloadSvg() {
                if (svgRef.current) {
                    const svgContent = svgRef.current.outerHTML.replaceAll('stroke="white"', 'stroke="black"');
                    const a = document.createElement("a");
                    const blob = new Blob([svgContent], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    a.setAttribute("href", url);
                    a.setAttribute("download", "tree_visualization.svg");
                    a.click();
                }
            }
        }
    });

    return (
        <div className={clsx("relative", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                ref={svgRef}
                className="h-full w-full"
                viewBox={`0 0 ${treeLayout.width} ${treeLayout.height}`}
            >
                {treeLayout.edges.map(edge => {
                    return <line key={`${edge.x1}${edge.x2}`} x1={edge.x1} x2={edge.x2} y1={edge.y1} y2={edge.y2} stroke={edge.isRed ? "red" : edgeColor} />
                })}
                {treeLayout.nodes.map(node => {
                    return <BTreeGraphNode key={node.keys.join("")} vals={node.keys} pos={{ x: node.posX, y: node.posY }} nodeColor={nodeColor} textColor={textColor} />
                })}
            </svg>
        </div>
    );
};

export default forwardRef(BTreeGraph);