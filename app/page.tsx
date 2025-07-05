"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey";
import { deleteSurvey, getSurveys } from "@/lib/survey";
import { SurveyCard } from "@/components/survey/survey-card";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";

export default function Home() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSurveys(getSurveys());
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteSurvey(id);
    setSurveys(getSurveys());
    toast.success("Survey deleted successfully");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Frontend Engineer Test Builder</h1>
        <Button onClick={() => router.push("/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Test
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loading fullHeight text="Loading surveys..." />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}