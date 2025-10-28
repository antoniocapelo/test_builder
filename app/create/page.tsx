"use client";

import { SurveyForm } from "@/components/survey/survey-form";
import { useFormValidation } from "@/hooks/use-form-validation";
import { loadDraft, saveSurvey } from "@/lib/survey";
import { Survey, surveySchema } from "@/types/survey";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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