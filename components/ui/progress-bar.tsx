import { cn } from "@/lib/utils";
import React from "react";

interface ProgressBarProps {
    value: number; // 0 to 1
    className?: string; // Optional className for additional styling
}

export default function ProgressBar({ value, className }: ProgressBarProps) {
    return (
        <div className={cn("w-full h-1 bg-muted rounded-full overflow-hidden mb-6", className)}>
            <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.round(value * 100)}%` }}
            />
        </div>
    );
}
