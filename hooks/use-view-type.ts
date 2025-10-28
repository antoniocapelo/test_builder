import { defaultLayout, getViewType, saveViewType, ViewType } from "@/lib/layout";
import { useEffect, useState } from "react";

export function useViewType(path: string) {
    const [viewType, setViewType] = useState<ViewType>(defaultLayout);

    useEffect(() => {
        const storedViewType = getViewType(path, defaultLayout);
        setViewType(storedViewType);
    }, [path]);

    const toggleViewType = () => {
        const newViewType = viewType === 'grid' ? 'table' : 'grid';
        setViewType(newViewType);
        saveViewType(path, newViewType);
    };

    return { viewType, toggleViewType };
}