"use client";

import { Input } from "@/components/ui/input";
import { Question } from "@/types/survey";

interface TextQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={question.required}
      data-question-id={question.id}
    />
  );
}