"use client";

export const dynamic = "force-dynamic";

import { useFormValidation } from "@/hooks/use-form-validation";
import { getSurveyById, saveDraft, saveSurvey } from "@/lib/survey";
import { Question, Survey, surveySchema } from "@/types/survey";
import { SurveyForm } from "@/components/survey/survey-form";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

export default function EditSurvey() {
  const router = useRouter();
  const params = useParams();
  const [survey, setSurvey] = useState<Survey>();
  const [isLoading, setIsLoading] = useState(true);
  const { errors, validate, resetError } = useFormValidation(surveySchema);

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

  const handleSave = () => {
    if (!survey) return;
    const isValid = validate(survey);
    if (!isValid) {
      return;
    }
    survey.modifiedAt = new Date().toISOString();
    saveSurvey(survey);
    router.push("/");
  };

  if (isLoading) {
    return <Loading fullHeight text="Loading survey..." />;
  }

  if (!survey) {
    return null
  }

  return (
    <SurveyForm
      survey={survey}
      // Casting because at this point we know survey is defined
      setSurvey={setSurvey as Dispatch<React.SetStateAction<Survey>>}
      errors={errors}
      validate={validate}
      resetError={resetError}
      isLoading={false}
      onSave={handleSave}
      mode="edit"
    />
  );
}