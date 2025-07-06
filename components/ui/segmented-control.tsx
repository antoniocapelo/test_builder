import { cn } from "@/lib/utils";
import { Table, LayoutGrid } from "lucide-react";

type SegmentedControlProps<T> = {
    value: T;
    onChange: (value: T) => void;
    options?: { label: string; value: T; }[];
};

export function SegmentedControl<T>({
    value,
    onChange,
    options = [],
}: SegmentedControlProps<T>) {
    return (
        <div className="inline-flex rounded-md bg-muted p-1">
            {options.map((option) => (
                <button
                    key={option.value as string}
                    type="button"
                    className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        value === option.value
                            ? "bg-white shadow text-primary"
                            : "bg-transparent text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => value !== option.value && onChange(option.value)}
                    aria-pressed={value === option.value}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}