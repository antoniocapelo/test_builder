"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question, QuestionType } from "@/types/survey";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: (id: string) => void;
  error: string | undefined;
}

export function QuestionBuilder({ question, onUpdate, onDelete, error }: QuestionBuilderProps) {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: "text", label: "Text Input" },
    { value: "checkbox", label: "Checkbox (Multiple Choice)" },
    { value: "radio", label: "Radio (Single Choice)" },
    { value: "multiselect", label: "Multi Select" },
    { value: "singleselect", label: "Single Select" },
    { value: "date", label: "Date Picker" },
    { value: "rating", label: "Rating" },
  ];
  let errorMsg;
  if (error) {
    // Find the first property with _errors and display its first error message
    errorMsg = typeof error === "object" && error !== null
      ? Object.values(error)
        .flatMap((v: any) => v?._errors || [])
        .filter(Boolean)[0]
      : typeof error === "string"
        ? error
        : null
  }
  const showOptions = ["checkbox", "radio", "multiselect", "singleselect"].includes(question.type);

  const handleOptionAdd = () => {
    const newOption = { id: crypto.randomUUID(), text: "" };
    onUpdate({
      ...question,
      options: [...(question.options || []), newOption],
    });
  };

  const handleOptionUpdate = (optionId: string, text: string) => {
    onUpdate({
      ...question,
      options: question.options?.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      ),
    });
  };

  const handleOptionDelete = (optionId: string) => {
    onUpdate({
      ...question,
      options: question.options?.filter((opt) => opt.id !== optionId),
    });
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Question text"
            value={question.text}
            onChange={(e) => onUpdate({ ...question, text: e.target.value })}
          />
        </div>
        <Select
          value={question.type}
          onValueChange={(value: QuestionType) =>
            onUpdate({ ...question, type: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Question type" />
          </SelectTrigger>
          <SelectContent>
            {questionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(question.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id={`required-${question.id}`}
          checked={question.required}
          onCheckedChange={(checked) =>
            onUpdate({ ...question, required: checked })
          }
        />
        <Label htmlFor={`required-${question.id}`}>Required</Label>
      </div>

      {showOptions && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <div key={option.id} className="flex gap-2">
              <Input
                placeholder="Option text"
                value={option.text}
                onChange={(e) => handleOptionUpdate(option.id, e.target.value)}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleOptionDelete(option.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={handleOptionAdd} variant="outline">
            Add Option
          </Button>
        </div>
      )}
      {errorMsg && (
        <p className="text-sm text-destructive mt-2">
          {errorMsg}
        </p>
      )}
    </Card>
  );
}