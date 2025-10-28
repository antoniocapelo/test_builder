"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from "@/types/survey";

interface SelectQuestionProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function SelectQuestion({ question, value, onChange }: SelectQuestionProps) {
  return (
    <Select value={value as string} onValueChange={onChange}>
      <SelectTrigger
        data-question-id={question.id}
      >
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.options?.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}