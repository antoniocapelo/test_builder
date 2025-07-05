"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from "@/types/survey";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiselectQuestionProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiselectQuestion({
  question,
  value = [],
  onChange,
}: MultiselectQuestionProps) {
  const handleSelect = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const selectedOptions = question.options?.filter((option) =>
    value.includes(option.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
        {selectedOptions?.map((option) => (
          <Badge
            key={option.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {option.text}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleSelect(option.id)}
            />
          </Badge>
        ))}
      </div>
      <Select
        value=""
        onValueChange={handleSelect}
      >
        <SelectTrigger className={cn(
          "w-full",
          selectedOptions?.length ? "border-dashed" : ""
        )}
          data-question-id={question.id}
        >
          <SelectValue placeholder="Select options..." />
        </SelectTrigger>
        <SelectContent>
          {question.options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
              disabled={value.includes(option.id)}
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}