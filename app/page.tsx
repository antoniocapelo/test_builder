"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey";
import { deleteSurvey, generateShareableLink, getSurveyResponses, getSurveys } from "@/lib/survey";
import { SurveyCard } from "@/components/survey/survey-card";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useViewType } from "@/hooks/use-view-type";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleViewType, viewType } = useViewType('/')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSurveys(getSurveys());
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteSurvey(id);
    setSurveys(getSurveys());
    toast.success("Survey deleted successfully");
  };

  const handleShare = (survey: Survey) => {
    const link = generateShareableLink(survey!.id);
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const noResults = !isLoading && filteredSurveys.length === 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Frontend Engineer Test Builder</h1>
        <Button onClick={() => router.push("/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Test
        </Button>
      </div>
      <div className="flex gap-4 items-center justify-between w-full mb-6">
        <div className="items-center gap-4 p-4 w-full flex justify-between rounded-lg border bg-card text-card-foreground ">
          <input
            type="text"
            placeholder="Search"
            className="mr-4 px-2 py-1 border rounded text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 180 }}
          />

          <div className="flex items-center gap-4">
            <span className="text-sm">Cards</span>
            <Switch checked={viewType === 'table'} onCheckedChange={toggleViewType} />
            <span className="text-sm">Table</span>

          </div>
        </div>

      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loading fullHeight text="Loading surveys..." />
        </div>
      )}

      {viewType === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onDelete={handleDelete}
            />
          ))}
          {noResults && (
            <div className="p-6 flex w-full flex-col items-center justify-center">
              <p className="text-muted-foreground text-center">
                No surveys found
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-card border ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell><Link className="text-primary underline-offset-4 hover:underline font-medium" href={`/survey/${survey.id}`}>{survey.title}</Link></TableCell>
                  <TableCell>{getSurveyResponses(survey.id).length ?? 0}</TableCell>
                  <TableCell>{survey.modifiedAt ? new Date(survey.modifiedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</TableCell>
                  <TableCell align="right">
                    <span className="space-x-2">
                      <Link href={`/survey/${survey.id}/responses`}><Button variant="link" size="sm" >Responses</Button></Link>
                      <Link href={`/edit/${survey.id}`}> <Button variant="link" size="sm">Edit</Button></Link>
                      <Button variant="link" size="sm" onClick={() => handleShare(survey)}>Share</Button>
                      <Button variant="link" className="text-destructive" size="sm" onClick={() => handleDelete(survey.id)}>Delete</Button>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {noResults && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <p className="text-muted-foreground">No surveys found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}