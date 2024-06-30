"use client"

import { useTextWidth } from "@/components/UseTextWidth";

export const BTreeGraphNode = <T,>(
    { vals, pos, nodeColor = "blue", textColor = "white" }:
    { vals: T[], pos: { x: number, y: number }, nodeColor?: string, textColor?: string }
) => {
    const height = 30;
    const paddingX = 15;

    const textWidth = useTextWidth({ text: vals.join(" | "), font: "12 Times New Roman"});
    const width = textWidth + (2 * paddingX);


    return (
        <g>
            <rect x={pos.x - width / 2} y={pos.y - height / 2} ry={height / 2} width={width} height={height} fill={nodeColor} />
            <text x={pos.x} y={pos.y + 1} fill={textColor} fontSize={14} textAnchor="middle" dominantBaseline="middle">{vals.join(" | ")}</text>
        </g>
    )
}