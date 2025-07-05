"use client";

export const dynamic = 'force-dynamic';

import { QuestionBuilder } from "@/components/survey/question-builder";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { getSurveyById, saveDraft, saveSurvey } from "@/lib/survey";
import { Question, Survey, surveySchema } from "@/types/survey";
import { set } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSurvey() {
  const router = useRouter();
  const params = useParams();
  const [survey, setSurvey] = useState<Survey>();
  const [isLoading, setIsLoading] = useState(true);
  const { errors, validate, resetError } = useFormValidation(surveySchema)

  useEffect(() => {
    if (params.id) {
      const loadedSurvey = getSurveyById(params.id as string);
      setIsLoading(false);
      if (loadedSurvey) {
        setSurvey(loadedSurvey);
      } else {
        router.push("/");
      }
    }
  }, [params.id, router]);

  const addQuestion = () => {
    if (!survey) return;
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

    saveDraft(survey!);

    router.push(
      '/survey/preview',
    );
  };

  const updateQuestion = (updatedQuestion: Question) => {
    if (!survey) return;
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    if (!survey) return;
    setSurvey({
      ...survey,
      questions: survey.questions.filter((q) => q.id !== questionId),
    });
  };

  const handleSave = () => {
    if (!survey) return;
    const isValid = validate(survey)

    if (!isValid) {
      return;
    }

    survey.modifiedAt = new Date().toISOString();
    saveSurvey(survey);
    router.push("/");
  };

  if (isLoading || !survey) {
    return <Loading fullHeight text="Loading survey..." />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Test</h1>

        <div className="space-y-4 mb-8">
          <Input
            placeholder="Test Title"
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
          />
          {errors?.title && <p className="text-sm text-destructive mt-2">{errors.title._errors}</p>}
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
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
        {errors?.questions && <p className="text-sm text-destructive mt-2">{errors.questions._errors}</p>}
      </div>
    </div>
  );
}