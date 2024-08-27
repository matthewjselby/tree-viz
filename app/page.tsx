"use client"

import BTreeGraph, { BTreeGraphHandle } from "@/components/BTreeGraph";
import { TreeControls } from "@/components/TreeControls";
import { BTree } from "@/lib/BTree";
import { TreeLayout } from "@/lib/TreeLayout";
import { LLRBTree } from "@/lib/LLRBTree";
import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/16/solid";
import { Slider } from "@/components/Slider";

export default function Home() {
    // tree spacing
    const [spacingX, setSpacingX] = useState(70);
    const [spacingY, setSpacingY] = useState(60);
    const [paddingX, setPaddingX] = useState(35);
    const [paddingY, setPaddingY] = useState(20);
    // tree options
    const [treeType, setTreeType] = useState<"llrb" | "23">("23");
    const [keyType, setKeyType] = useState<"string" | "number">("string");
    const [nodeColor, setNodeColor] = useState("#0cb1c2");
    const [edgeColor, setEdgeColor] = useState("#6b6b6b");
    const [textColor, setTextColor] = useState("#fafafa")
    // idk how to properly handle the generics here so I'm just going to keep track of multiple trees
    const [llrbNumTree, setLlrbNumTree] = useState(new LLRBTree<number>());
    const [llrbStringTree, setLlrbStringTree] = useState(new LLRBTree<string>());
    const [stringTree, setStringTree] = useState(new BTree<string>());
    const [numTree, setNumTree] = useState(new BTree<number>());
    // tree layout
    const [treeLayout, setTreeLayout] = useState<TreeLayout>(stringTree.layout(spacingX, spacingY, paddingX, paddingY));
    const [addedNodes, setAddedNodes] = useState<string[]>([]);
    // refs
    const graphRef = useRef<BTreeGraphHandle>(null);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key == "d") {
            if (graphRef.current?.downloadSvg) {
                graphRef.current.downloadSvg();
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [handleKeyPress]);

    useEffect(() => {
        if (keyType === "string") {
            if (treeType == "llrb") {
                setTreeLayout(llrbStringTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(stringTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        } else {
            if (treeType == "llrb") {
                setTreeLayout(llrbNumTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(numTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        }
    }, [spacingX, spacingY, paddingX, paddingY]);

    const addNode = (newNode: string) => {
        if (keyType === "string") {
            llrbStringTree.insert(newNode);
            stringTree.insert(newNode);
            if (treeType == "llrb") {
                setTreeLayout(llrbStringTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(stringTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        } else {
            llrbNumTree.insert(Number(newNode));
            numTree.insert(Number(newNode));
            if (treeType == "llrb") {
                setTreeLayout(llrbNumTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(numTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        }
        setAddedNodes([...addedNodes, newNode]);
    }

    const clearTree = () => {
        setStringTree(new BTree<string>());
        setNumTree(new BTree<number>());
        setLlrbStringTree(new LLRBTree<string>());
        setLlrbNumTree(new LLRBTree<number>());
        setAddedNodes([]);
        setTreeLayout({ nodes: [], edges: [], width: 0, height: 0 });
    }

    const setTree = (treeType: "llrb" | "23") => {
        setTreeType(treeType);
        if (keyType === "string") {
            if (treeType == "llrb") {
                setTreeLayout(llrbStringTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(stringTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        } else {
            if (treeType == "llrb") {
                setTreeLayout(llrbNumTree.layout(spacingX, spacingY, paddingX, paddingY));
            } else {
                setTreeLayout(numTree.layout(spacingX, spacingY, paddingX, paddingY));
            }
        }
    }

    return (
        <main className="flex h-dvh flex-col items-center justify-between gap-10 lg:p-16 md:py-12 p-4">
            <h1>{treeType == "23" ? "2-3" : "LLRB"} Tree</h1>
            {
                addedNodes.length > 0
                    ? <BTreeGraph
                        ref={graphRef}
                        treeLayout={treeLayout}
                        nodeColor={nodeColor}
                        edgeColor={edgeColor}
                        textColor={textColor}
                        className="h-3/5 w-full"
                    />
                    : <div className="w-full flex justify-center"><p className="text-zinc-700">Add some nodes to create a tree.</p></div>
            }
            {
                addedNodes.length > 0
                    ? <div className="flex flex-col place-items-center text-center">
                        <p>Node order:</p>
                        <div className="flex align-middle gap-1 flex-wrap justify-center">
                            {addedNodes.map((addedNode, idx) => {
                                return (
                                    <div className="flex align-middle gap-1" key={addedNode}>
                                        <span>{addedNode}</span>
                                        {idx != addedNodes.length - 1 ? <ArrowLongRightIcon className="size-3 my-auto" /> : <></>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    : <></>
            }
            <TreeControls
                addNode={addNode}
                clearTree={clearTree}
                keyType={keyType}
                setKeyType={setKeyType}
                treeType={treeType}
                setTreeType={setTree}
                nodeColor={nodeColor}
                setNodeColor={setNodeColor}
                edgeColor={edgeColor}
                setEdgeColor={setEdgeColor}
                textColor={textColor}
                setTextColor={setTextColor}
                downloadGraphSvg={graphRef.current?.downloadSvg}
                spacingX={spacingX}
                setSpacingX={setSpacingX}
                spacingY={spacingY}
                setSpacingY={setSpacingY}
                paddingX={paddingX}
                setPaddingX={setPaddingX}
                paddingY={paddingY}
                setPaddingY={setPaddingY}
                className=""
            />
        </main>
    );
}
