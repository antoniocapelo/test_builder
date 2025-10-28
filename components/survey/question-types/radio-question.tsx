"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/types/survey";

interface RadioQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function RadioQuestion({ question, value, onChange }: RadioQuestionProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} required={question.required}>
      {question.options?.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.id}
            id={option.id}
            data-question-id={question.id}
          />
          <Label htmlFor={option.id}>{option.text}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}