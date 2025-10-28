"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question } from "@/types/survey";

interface RatingQuestionProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
}

export function RatingQuestion({ question, value = 0, onChange }: RatingQuestionProps) {
  const maxRating = 5;

  return (
    <div className="flex gap-2">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starNumber = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={cn(
              "rounded-md p-2 hover:bg-accent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onClick={() => onChange(starNumber)}
            data-question-id={question.id}
          >
            <Star
              className={cn(
                "h-6 w-6",
                starNumber <= value
                  ? "fill-primary text-primary"
                  : "fill-none text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
} 