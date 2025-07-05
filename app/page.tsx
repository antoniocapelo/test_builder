"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey";
import { deleteSurvey, getSurveyResponses, getSurveys } from "@/lib/survey";
import { SurveyCard } from "@/components/survey/survey-card";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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
        <div className="flex gap-4 items-center">
          <span className="text-sm">Cards</span>
          <Switch checked={viewMode === 'table'} onCheckedChange={(checked) => setViewMode(checked ? 'table' : 'cards')} />
          <span className="text-sm">Table</span>
          <Button onClick={() => router.push("/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loading fullHeight text="Loading surveys..." />
        </div>
      )}

      {viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.title}</TableCell>
                  <TableCell>{getSurveyResponses(survey.id).length ?? 0}</TableCell>
                  <TableCell>{survey.modifiedAt ? new Date(survey.modifiedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</TableCell>
                  <TableCell>
                    <span className="space-x-2">
                      <Button variant="link" size="sm" onClick={() => router.push(`/edit/${survey.id}`)}>Edit</Button>
                      <Button variant="link" size="sm" onClick={() => router.push(`/survey/${survey.id}/preview`)}>Share</Button>
                      <Button variant="link" size="sm" onClick={() => router.push(`/survey/${survey.id}/responses`)}>Results</Button>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}