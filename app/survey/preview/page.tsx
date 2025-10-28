"use client";

export const dynamic = 'force-dynamic';

import SurveyDisplay from "@/components/survey/survey-display";
import { createSurveyValidationSchema } from "@/components/survey/validation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useFormValidation } from "@/hooks/use-form-validation";
import { generateShareableLink, getSurveyById, loadDraft, saveDraft, saveSurveyResponse } from "@/lib/survey";
import { Survey } from "@/types/survey";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";


export default function PreviewChanges() {
    const params = useParams();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const router = useRouter();
    const [surveySchema, setSurveySchema] = useState<z.ZodSchema>();
    const { errors, resetError, validate } = useFormValidation(surveySchema)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const survey = loadDraft();
        if (survey) {
            setSurvey(survey);
            const surveySchema = createSurveyValidationSchema(survey.questions);
            setSurveySchema(surveySchema);
        }
        setIsLoading(false);
    }, [params.id]);

    if (isLoading) {
        return <Loading fullHeight text="Loading survey..." />;
    }

    if (!survey) {
        return <div>Survey not found</div>;
    }



    const handleBackToEdit = () => {
        saveDraft(survey!);
        const isSurveySaved = getSurveyById(survey!.id);
        if (isSurveySaved) {
            router.push(`/edit/${survey.id}`);
        } else {
            router.push("/create");
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
                <SurveyDisplay survey={survey} answers={answers} onAnswerChange={handleAnswerChange} errors={errors} />

                <div className="mt-8 flex justify-end">
                    <Button onClick={handleBackToEdit}>Back to Edit mode</Button>
                </div>
            </div>
        </div>
    );
}