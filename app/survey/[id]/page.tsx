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


export default function SurveyPreview() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | undefined>();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();
  const [errors, setErrors] = useState<z.ZodFormattedError<
    Record<string, any>
  > | null>(null);


  useEffect(() => {
    if (params.id) {
      const loadedSurvey = getSurveyById(params.id as string);
      setSurvey(loadedSurvey);
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
    const surveySchema = createSurveyValidationSchema(survey.questions);
    const result = surveySchema.safeParse(answers);
    console.log(result.error, result.error?.formErrors, result.error?.format())

    if (!result.success) {
      setErrors(result.error.format());
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
    if (errors?.[questionId]) {
      setErrors((prevErrors) => {
        if (!prevErrors) return null;
        const newErrors = { ...prevErrors };
        delete (newErrors as any)[questionId];
        return newErrors;
      });
    }
  };

  console.log('errors', errors?.['8954f9b4-87c3-4013-91b8-13d148ae9e84'])
  console.log('questions', survey.questions)

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

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>Submit Survey</Button>
        </div>
      </div>
    </div>
  );
}