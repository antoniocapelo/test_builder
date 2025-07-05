"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/survey";
import { TextQuestion } from "./question-types/text-question";
import { RadioQuestion } from "./question-types/radio-question";
import { CheckboxQuestion } from "./question-types/checkbox-question";
import { SelectQuestion } from "./question-types/select-question";
import { MultiselectQuestion } from "./question-types/multiselect-question";
import { DateQuestion } from "./question-types/date-question";
import { RatingQuestion } from "./question-types/rating-question";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function QuestionDisplay({ question, value, onChange, error }: QuestionDisplayProps) {
  const showError = !!error;

  return (
    <Card className={cn("p-6", showError && "border-destructive")}>
      <Label className="text-lg mb-4 block">
        {question.text}
        {!question.required && <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>}
      </Label>

      {question.type === "text" && (
        <TextQuestion
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "radio" && (
        <RadioQuestion
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "checkbox" && (
        <CheckboxQuestion
          question={question}
          value={value || []}
          onChange={onChange}
        />
      )}

      {question.type === "singleselect" && (
        <SelectQuestion
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "multiselect" && (
        <MultiselectQuestion
          question={question}
          value={value || []}
          onChange={onChange}
        />
      )}

      {question.type === "date" && (
        <DateQuestion
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "rating" && (
        <RatingQuestion
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {showError && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </Card>
  );
}