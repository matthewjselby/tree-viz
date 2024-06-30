"use client"

import { Field, Input, RadioGroup, Radio, Button, Popover, PopoverButton, PopoverPanel, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon, XCircleIcon, ArrowDownOnSquareIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import { Cog8ToothIcon, SwatchIcon } from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";
import Slider from "rc-slider";
import { useState } from "react";
import clsx from "clsx";

export const TreeControls = (
    {
        addNode,
        clearTree,
        keyType,
        setKeyType,
        treeType,
        setTreeType,
        nodeColor,
        setNodeColor,
        edgeColor,
        setEdgeColor,
        textColor,
        setTextColor,
        downloadGraphSvg,
        spacingX,
        setSpacingX,
        spacingY,
        setSpacingY,
        paddingX,
        setPaddingX,
        paddingY,
        setPaddingY,
        className
    }: {
        addNode: (newNode: string) => void,
        clearTree: () => void,
        keyType: "string" | "number",
        setKeyType: (keyType: "string" | "number") => void,
        treeType: "llrb" | "23",
        setTreeType: (treeType: "llrb" | "23") => void,
        nodeColor: string,
        setNodeColor: (nodeColor: string) => void,
        edgeColor: string,
        setEdgeColor: (edgeColor: string) => void,
        textColor: string,
        setTextColor: (textColor: string) => void,
        downloadGraphSvg?: () => void,
        spacingX: number,
        setSpacingX: (spacingX: number) => void,
        spacingY: number,
        setSpacingY: (spacingY: number) => void,
        paddingX: number,
        setPaddingX: (paddingX: number) => void,
        paddingY: number,
        setPaddingY: (paddingY: number) => void,
        className?: string
    }
) => {
    const [nodeValue, setNodeValue] = useState("");
    const [nodeIsInvalid, setNodeIsInvalid] = useState(true);
    const [colorInput, setColorInput] = useState<"node" | "edge" | "text">("node");

    const isNumeric = (s: string) => {
        return /^-?\d+$/.test(s);
    }

    const setColor = (color: string) => {
        if (colorInput == "node") {
            setNodeColor(color);
        } else if (colorInput == "edge") {
            setEdgeColor(color);
        } else if (colorInput == "text") {
            setTextColor(color);
        }
    }

    return (
        <div className={clsx("flex md:flex-row lg:px-0 md:px-4 p-0 flex-col gap-4 w-full", className)}>
            <div className="md:self-end self-start flex gap-4">
                <Popover className="group">
                    <PopoverButton className="flex">
                        <Cog8ToothIcon className="size-6 stroke-zinc-500 focus:border-0 focus:shadow-none" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor={{ to: "top start", gap: 10, offset: -10 }}
                        className="w-72 flex flex-col items-stretch md:w-64 p-4 bg-black rounded-lg ring-1 ring-zinc-800 mx-2"
                    >
                        <Listbox value={keyType} onChange={setKeyType}>
                            <ListboxButton className="w-full inline-flex items-center justify-between ring-1 ring-zinc-800 rounded-md py-1.5 px-3 text-sm/6 font-semibold">
                                Key Type: {keyType == "string" ? "String" : "Number"}
                                <ChevronDownIcon className="size-4" />
                            </ListboxButton>
                            <ListboxOptions
                                anchor="bottom end"
                                className="w-[var(--button-width)] ring-1 ring-zinc-800 bg-black mt-1 rounded-md flex flex-col divide-y divide-zinc-800"
                            >
                                <ListboxOption
                                    value={"number"}
                                    className="group"
                                >
                                    <div className="p-2 hover:bg-slate-700/50 flex justify-between">
                                        <span>Number</span>
                                        <CheckIcon className="size-4 invisible mr-2 group-data-[selected]:visible my-auto" />
                                    </div>
                                </ListboxOption>
                                <ListboxOption
                                    value={"string"}
                                    className="group"
                                >
                                    <div className="group p-2 hover:bg-slate-700/50 flex justify-between">
                                        <span>String</span>
                                        <CheckIcon className="size-4 invisible mr-2 group-data-[selected]:visible my-auto" />
                                    </div>
                                </ListboxOption>
                            </ListboxOptions>
                        </Listbox>
                        <hr className="border-1 border-zinc-800 my-4" />
                        <Listbox value={treeType} onChange={setTreeType}>
                            <ListboxButton className="w-full inline-flex items-center justify-between ring-1 ring-zinc-800 rounded-md py-1.5 px-3 text-sm/6 font-semibold">
                                Tree Type: {treeType == "23" ? "2-3" : "LLRB"}
                                <ChevronDownIcon className="size-4" />
                            </ListboxButton>
                            <ListboxOptions
                                anchor="bottom end"
                                className="w-[var(--button-width)] ring-1 ring-zinc-800 bg-black mt-1 rounded-md flex flex-col divide-y divide-zinc-800"
                            >
                                <ListboxOption
                                    value={"llrb"}
                                    className="group"
                                >
                                    <div className="p-2 hover:bg-slate-700/50 flex justify-between">
                                        <span>Left Leaning Red Black</span>
                                        <CheckIcon className="size-4 invisible mr-2 group-data-[selected]:visible my-auto" />
                                    </div>
                                </ListboxOption>
                                <ListboxOption
                                    value={"23"}
                                    className="group"
                                >
                                    <div className="group p-2 hover:bg-slate-700/50 flex justify-between">
                                        <span>2-3</span>
                                        <CheckIcon className="size-4 invisible mr-2 group-data-[selected]:visible my-auto" />
                                    </div>
                                </ListboxOption>
                            </ListboxOptions>
                        </Listbox>
                        <hr className="border-1 border-zinc-800 my-4" />
                        <Button
                            className="self-end w-full grow flex items-center justify-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white ring-1 ring-zinc-800 hover:text-blue-500"
                            onClick={() => {
                                if (downloadGraphSvg) {
                                    downloadGraphSvg();
                                }
                            }}
                        >
                            <ArrowDownOnSquareIcon className="size-4" />
                            Download SVG
                        </Button>
                        <hr className="border-1 border-zinc-800 my-4" />
                        <Button
                            className="self-end w-full grow flex items-center justify-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white ring-1 ring-zinc-800 hover:text-red-500"
                            onClick={() => {
                                clearTree();
                                setNodeValue("");
                                setNodeIsInvalid(true);
                            }}
                        >
                            <XCircleIcon className="size-4" />
                            Clear tree
                        </Button>
                    </PopoverPanel>
                </Popover>
                <Popover className="group">
                    <PopoverButton className="flex">
                        <SwatchIcon className="size-6 stroke-zinc-500 focus:border-0 focus:shadow-none" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor={{ to: "top start", gap: 10, offset: -10 }}
                        className="w-72 flex flex-col justify-center items-stretch md:w-64 p-4 bg-black rounded-lg ring-1 ring-zinc-800 mx-2"
                    >
                        <RadioGroup value={colorInput} onChange={setColorInput} className="flex gap-2">
                            <Radio
                                key="node"
                                value="node"
                                className="grow rounded-md cursor-pointer flex justify-center bg-zinc-800 px-4 py-1 text-sm data-[checked]:ring-1 data-[checked]:ring-zinc-100"
                            >
                                Node
                            </Radio>
                            <Radio
                                key="edge"
                                value="edge"
                                className="grow rounded-md cursor-pointer flex justify-center bg-zinc-800 px-4 py-1 text-sm data-[checked]:ring-1 data-[checked]:ring-zinc-100"
                            >
                                Edge
                            </Radio>
                            <Radio
                                key="text"
                                value="text"
                                className="grow rounded-md cursor-pointer flex justify-center bg-zinc-800 px-4 py-1 text-sm data-[checked]:ring-1 data-[checked]:ring-zinc-100"
                            >
                                Text
                            </Radio>
                        </RadioGroup>
                        <HexColorPicker 
                            className="mx-auto mt-4"
                            color={colorInput === "node" ? nodeColor : colorInput === "edge" ? edgeColor : textColor}
                            onChange={setColor}
                        />
                    </PopoverPanel>
                </Popover>
                <Popover className="group">
                    <PopoverButton className="flex">
                        <AdjustmentsHorizontalIcon className="size-6 fill-zinc-500 focus:border-0 focus:shadow-none" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor={{ to: "top start", gap: 10, offset: -10 }}
                        className="w-72 flex flex-col justify-center items-stretch md:w-64 p-4 bg-black rounded-lg ring-1 ring-zinc-800 mx-2"
                    >
                        <p className="text-sm">Horizontal spacing:</p>
                        <Slider 
                            min={20}
                            max={100}
                            value={spacingX}
                            onChange={(val) => {typeof val === "number" ? setSpacingX(val) : {}}}
                            className="mt-3"
                            styles={{
                                "rail": {
                                    "backgroundColor": "#27272a",
                                },
                                "track": {
                                    "backgroundColor": "#27272a"
                                },
                                "handle": {
                                    "backgroundColor": "#27272a",
                                    "borderColor": "#a1a1aa"
                                }
                            }}
                        />
                        <p className="text-sm mt-3">Vertical spacing:</p>
                        <Slider 
                            min={20}
                            max={100}
                            value={spacingY}
                            onChange={(val) => {typeof val === "number" ? setSpacingY(val) : {}}}
                            className="mt-3"
                            styles={{
                                "rail": {
                                    "backgroundColor": "#27272a",
                                },
                                "track": {
                                    "backgroundColor": "#27272a"
                                },
                                "handle": {
                                    "backgroundColor": "#27272a",
                                    "borderColor": "#a1a1aa"
                                }
                            }}
                        />
                        <p className="text-sm mt-3">Padding (horizontal):</p>
                        <Slider 
                            min={10}
                            max={100}
                            value={paddingX}
                            onChange={(val) => {typeof val === "number" ? setPaddingX(val) : {}}}
                            className="mt-3"
                            styles={{
                                "rail": {
                                    "backgroundColor": "#27272a",
                                },
                                "track": {
                                    "backgroundColor": "#27272a"
                                },
                                "handle": {
                                    "backgroundColor": "#27272a",
                                    "borderColor": "#a1a1aa",
                                    
                                }
                            }}
                        />
                        <p className="text-sm mt-3">Padding (vertical):</p>
                        <Slider 
                            min={10}
                            max={100}
                            value={paddingY}
                            onChange={(val) => {typeof val === "number" ? setPaddingY(val) : {}}}
                            className="mt-3"
                            styles={{
                                "rail": {
                                    "backgroundColor": "#27272a",
                                },
                                "track": {
                                    "backgroundColor": "#27272a"
                                },
                                "handle": {
                                    "backgroundColor": "#27272a",
                                    "borderColor": "#a1a1aa"
                                }
                            }}
                        />
                    </PopoverPanel>
                </Popover>
            </div>

            <div className="grow md:block hidden"></div>
            <div className="min-w-64 flex flex-col order-first md:order-last">
                <Field onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        addNode(nodeValue);
                        setNodeValue("");
                        setNodeIsInvalid(true);
                    }
                }}
                >
                    <Input
                        className={clsx(
                            "w-full block rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none ring-1 ring-zinc-800"
                        )}
                        value={nodeValue}
                        onChange={(event) => {
                            setNodeValue(event.target.value);
                            if (event.target.value.length <= 0) {
                                setNodeIsInvalid(true);
                            } else if (keyType === "number") {
                                setNodeIsInvalid(!isNumeric(event.target.value));
                            } else {
                                setNodeIsInvalid(false);
                            }
                        }}

                        invalid={nodeIsInvalid}
                    />
                </Field>
                <Button
                    className={
                        clsx(
                            "justify-self-stretch mt-4 items-center justify-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white ring-1 ring-zinc-800",
                            "data-[disabled]:text-red-500"

                        )}
                    onClick={() => {
                        addNode(nodeValue);
                        setNodeValue("");
                        setNodeIsInvalid(true);
                    }}
                    disabled={nodeIsInvalid}
                >
                    {nodeIsInvalid ? "Enter a valid node value" : "Add node"}
                </Button>

            </div>
        </div>
    )
}