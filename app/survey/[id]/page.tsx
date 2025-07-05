"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "@/components/survey/question-display";
import { generateShareableLink, getSurveyById, saveSurveyResponse } from "@/lib/survey";
import { Survey } from "@/types/survey";
import { Share2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { createSurveyValidationSchema } from "@/components/survey/validation";
import { useZodFormValidation } from "@/hooks/use-zod-form-validation";
import { Card } from "@/components/ui/card";


export default function SurveyPreview() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | undefined>();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();
  const [surveySchema, setSurveySchema] = useState<z.ZodSchema>();
  const { errors, resetError, validate } = useZodFormValidation(surveySchema)

  useEffect(() => {
    if (params.id) {
      const loadedSurvey = getSurveyById(params.id as string);
      setSurvey(loadedSurvey);

      if (loadedSurvey) {
        const surveySchema = createSurveyValidationSchema(loadedSurvey.questions);
        setSurveySchema(surveySchema);
      }
    }
  }, [params.id]);

  if (!survey) {
    return <div>Survey not found</div>;
  }



  const handleShare = () => {
    const link = generateShareableLink(survey!.id);
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleSubmit = () => {
    const isValid = validate(answers);

    if (!isValid) {
      toast.error("Please answer all required questions correctly.");
      return;
    }


    // Format answers for submission
    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    // Create and save response
    const response = {
      id: crypto.randomUUID(),
      surveyId: survey.id,
      answers: formattedAnswers,
      submittedAt: new Date().toISOString(),
    };

    saveSurveyResponse(response);
    toast.success("Survey submitted successfully!");
    router.push("/");
  };

  const handleErrorClick = () => {
    // find first question that's present in the errors object
    const firstError = survey.questions.find((question) => !!errors?.[question.id])

    if (firstError) {
      const el: HTMLElement | null = document.querySelector(`[data-question-id="${firstError.id}"]`);
      if (el) {
        // @ts-expect-error (this is an experimental feature, only works in FF for now)
        el.focus({ focusVisible: true });
      }

    }
  };


  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear errors for the field when it's changed for a better UX
    resetError(questionId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            <p className="text-muted-foreground">{survey.description}</p>
          </div>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="space-y-6">
          {survey.questions.map((question) => (
            <QuestionDisplay
              key={question.id}
              question={question}
              value={answers[question.id]}
              error={errors?.[question.id]?._errors[0]}
              onChange={(value) => handleAnswerChange(question.id, value)}
            />
          ))}
        </div>

        {errors && <Card className="p-4 mt-6">
          ⚠️ Your survey has errors. Click <button className="text-destructive" onClick={handleErrorClick}>here</button> to go to the first one.
        </Card>}

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>Submit Survey</Button>
        </div>
      </div>
    </div>
  );
}