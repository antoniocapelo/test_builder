"use client";

import { QuestionBuilder } from "@/components/survey/question-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { loadDraft, saveDraft, saveSurvey } from "@/lib/survey";
import { Question, Survey, surveySchema } from "@/types/survey";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setSurvey(savedDraft);
    }
  }, [])

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

  const previewChanges = () => {
    const isValid = validate(survey)
    if (!isValid) {
      return;
    }
    // For now, just log the survey to console
    console.log("Preview Survey:", survey);

    saveDraft(survey);

    router.push(
      '/survey/preview',
    );
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
      debugger
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

          <div className="flex items-center space-x-2 px-3">
            <Checkbox
              id="show-progress"
              name="show-progress"
              checked={survey.showProgress || false}
              onCheckedChange={() => {
                setSurvey({ ...survey, showProgress: !survey.showProgress });
              }}
            />
            <Label htmlFor="show-progress">Show progress bar</Label>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3 mt-6">Questions</h2>
        <div className="space-y-4 mb-8">
          {!survey.questions.length && (
            <p className="text-sm text-muted-foreground">
              No questions added yet. Click "Add Question" to start.
            </p>
          )}
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
          <Button onClick={previewChanges} variant="outline">
            Preview Changes
          </Button>
          <Button onClick={handleSave}>Save Test</Button>
        </div>
        {errors?.questions && <p className="text-sm text-destructive mt-2">{errors.questions._errors}</p>}
      </div>
    </div>
  );
}