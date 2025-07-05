"use client";

import { useFormValidation } from "@/hooks/use-form-validation";
import { loadDraft, saveDraft, saveSurvey } from "@/lib/survey";
import { Question, Survey, surveySchema } from "@/types/survey";
import { SurveyForm } from "@/components/survey/survey-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateSurvey() {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    questions: [],
    createdAt: new Date().toISOString(),
  });
  const { errors, validate, resetError } = useFormValidation(surveySchema);

  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setSurvey(savedDraft);
    }
  }, []);




  const handleSave = () => {
    const isValid = validate(survey);
    if (!isValid) {
      return;
    }
    survey.modifiedAt = new Date().toISOString();
    saveSurvey(survey);
    toast.success(
      <span>
        Test saved successfully! You can view it{" "}
        <Link className="text-primary underline" href={`/survey/${survey.id}`}>
          here
        </Link>
      </span>
    );
    router.push("/");
  };

  return (
    <SurveyForm
      survey={survey}
      setSurvey={setSurvey}
      errors={errors}
      resetError={resetError}
      isLoading={false}
      validate={validate}
      onSave={handleSave}
      mode="create"
    />
  );
}