"use client";

export const dynamic = 'force-dynamic';

import { QuestionDisplay } from "@/components/survey/question-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressBar from "@/components/ui/progress-bar";
import { FormErrors } from "@/hooks/use-form-validation";
import { generateShareableLink } from "@/lib/survey";
import { Survey } from "@/types/survey";
import { Share2 } from "lucide-react";
import { toast } from "sonner";


export default function SurveyDisplay({ survey, answers, onAnswerChange, errors, showShare }: {
    survey: Survey,
    answers: Record<string, any>,
    errors?: FormErrors;
    onAnswerChange: (questionId: string, value: any) => void
    showShare?: boolean;
}) {
    const handleShare = () => {
        const link = generateShareableLink(survey!.id);
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
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

    return (
        <>
            {survey.showProgress && (
                <ProgressBar
                    className="sticky top-[52px] z-10"
                    value={
                        survey.questions.length === 0
                            ? 0
                            : Object.keys(answers).length / (survey.questions.filter(e => e.required)).length
                    }
                />
            )}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
                    <p className="text-muted-foreground">{survey.description}</p>
                </div>
                {showShare && (
                    <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {survey.questions.map((question) => (
                    <QuestionDisplay
                        key={question.id}
                        question={question}
                        value={answers[question.id]}
                        error={errors?.[question.id]?._errors[0]}
                        onChange={(value) => onAnswerChange(question.id, value)}
                    />
                ))}
            </div>

            {Object.keys(errors || {}).length > 0 && <Card className="p-4 mt-6">
                ⚠️ Your survey has errors. Click <button className="text-destructive" onClick={handleErrorClick}>here</button> to go to the first one.
            </Card>}
        </>
    );
}