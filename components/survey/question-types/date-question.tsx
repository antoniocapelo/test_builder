"use client";

import { Calendar } from "@/components/ui/calendar";
import { Question } from "@/types/survey";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DateQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function DateQuestion({ question, value, onChange }: DateQuestionProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? parseISO(value) : undefined
  );

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate ? newDate.toISOString() : '');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          data-question-id={question.id}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
} 