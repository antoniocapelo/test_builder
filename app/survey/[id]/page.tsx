"use client";

export const dynamic = 'force-dynamic';

import SurveyDisplay from "@/components/survey/survey-display";
import { createSurveyValidationSchema } from "@/components/survey/validation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useFormValidation } from "@/hooks/use-form-validation";
import { generateShareableLink, getSurveyById, saveSurveyResponse } from "@/lib/survey";
import { Survey } from "@/types/survey";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";


export default function SurveyPreview() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | undefined>();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();
  const [surveySchema, setSurveySchema] = useState<z.ZodSchema>();
  const { errors, resetError, validate } = useFormValidation(surveySchema)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      setIsLoading(false)
      const loadedSurvey = getSurveyById(params.id as string);
      setSurvey(loadedSurvey);

      if (loadedSurvey) {
        const surveySchema = createSurveyValidationSchema(loadedSurvey.questions);
        setSurveySchema(surveySchema);
      }
    }
  }, [params.id]);

  if (isLoading) {
    return <Loading fullHeight text="Loading survey..." />;
  }

  if (!survey) {
    return <div>Survey not found</div>;
  }

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


  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear errors for the field when it's changed for a better UX
    resetError(questionId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <SurveyDisplay survey={survey} answers={answers} onAnswerChange={handleAnswerChange} errors={errors} />

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>Submit Survey</Button>
        </div>
      </div>
    </div>
  );
}