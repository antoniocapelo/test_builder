"use client";

import { QuestionBuilder } from "@/components/survey/question-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { saveSurvey } from "@/lib/survey";
import { Question, Survey } from "@/types/survey";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from 'zod'

const surveySchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string(),
  questions: z.array(z.any()).min(1, { message: 'At least one question is required' })
})

export default function CreateSurvey() {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    questions: [],
    createdAt: new Date().toISOString(),
  });
  const { errors, validate, resetError } = useFormValidation(surveySchema)

  const addQuestion = () => {
    resetError('questions');
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: "text",
      text: "",
      options: [],
      required: false,
    };
    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    });
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter((q) => q.id !== questionId),
    });
  };

  const handleSave = () => {
    const isValid = validate(survey)
    if (!isValid) {
      return;
    }
    saveSurvey(survey);
    router.push("/");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Test</h1>

        <div className="space-y-4 mb-8">
          <div>
            <Input
              placeholder="Test Title"
              value={survey.title}
              onChange={(e) => {
                setSurvey({ ...survey, title: e.target.value });
                resetError('title');
              }}
            />
            {errors?.title && <p className="text-sm text-destructive mt-2">{errors.title._errors}</p>}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <Textarea
            placeholder="Test Description"
            value={survey.description}
            onChange={(e) =>
              setSurvey({ ...survey, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-4 mb-8">
          {survey.questions.map((question) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={addQuestion} variant="outline">
            Add Question
          </Button>
          <Button onClick={handleSave}>Save Test</Button>
        </div>
        {errors?.questions && <p className="text-sm text-destructive mt-2">{errors.questions._errors}</p>}
      </div>
    </div>
  );
}