export const BTreeGraphNode = (
    { vals, pos, color = "blue" }:
    { vals: string[] | number[], pos: { x: number, y: number }, color?: string }
) => {
    const height = 30;
    const width = vals.length > 1 ? 50 : 30;
    return (
        <g>
            <rect x={pos.x - width / 2} y={pos.y - height / 2} ry={height / 2} width={width} height={height} fill={color} />
            <text x={pos.x} y={pos.y + 1} fill="white" fontSize={14} textAnchor="middle" dominantBaseline="middle">{vals.join(" | ")}</text>
        </g>
    )
}