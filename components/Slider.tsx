import React, { useRef, DragEvent, useEffect, useState, useCallback } from "react";

export const Slider = (
    { 
        value,
        setValue,
        min = 0,
        max = 100,
        className,
        trackClassName,
        handleClassName
    }:
    { 
        value: number,
        setValue: (value: number) => void,
        min?: number,
        max?: number,
        className?: string,
        trackClassName?: string,
        handleClassName?: string
    }
) => {
    const dummyRef = useRef<HTMLDivElement>(null);
    const [handle, setHandle] = useState<HTMLDivElement | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const setInitialPos = () => {
        if (handle && container) {
            const containerBoundingRect = container.getBoundingClientRect();
            console.log(`${value * (containerBoundingRect.width / (max - min)) + containerBoundingRect.left}px`);
            handle.style.left = `${value * (containerBoundingRect.width / (max - min))}px`;
        }
    }

    const setUpHandle = useCallback((handle: HTMLDivElement) => {
        setHandle(handle);
    }, []);

    const setUpcontainer = useCallback((container: HTMLDivElement) => {
        setContainer(container);
    }, []);

    useEffect(() => {
        setInitialPos();
    }, [handle, container])

    const dragHandle = (event: DragEvent<HTMLDivElement>) => {
        if (handle && container) {
            const containerBoundingRect = container.getBoundingClientRect();
            const handleBoundingRect = handle.getBoundingClientRect();
            if (event.clientX > containerBoundingRect.left && event.clientX < containerBoundingRect.right) {
                handle.style.left = `${event.clientX - (handleBoundingRect.width / 2) - containerBoundingRect.left}px`;
                const currentVal = Math.floor((event.clientX - containerBoundingRect.left) * ((max - min + 1) / (containerBoundingRect.right - containerBoundingRect.left)) + min);
                setValue(currentVal);
            }
        }
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (dummyRef.current) {
            event.dataTransfer.setDragImage(dummyRef.current, 0, 0);
        }
    }

    return (
        <div ref={setUpcontainer} className={`relative flex ml-1 ${className}`}>
            <div className={`my-auto w-full ${trackClassName}`} />
            <div ref={dummyRef} className={`invisible ${handleClassName} w-1`} />
            <div ref={setUpHandle} className={`absolute ${handleClassName}`} draggable onDragStart={handleDragStart} onDrag={dragHandle}/>
        </div>
    )
}