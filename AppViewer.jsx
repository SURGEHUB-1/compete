import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function AppViewer() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setError("No project ID provided.");
      return;
    }
    base44.entities.Project.filter({ id: projectId }).then(projects => {
      const p = projects?.[0];
      if (!p?.code) {
        setError("Project not found or has no code.");
      } else {
        setCode(p.code);
      }
    }).catch(() => setError("Failed to load project."));
  }, [projectId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <iframe
      srcDoc={code}
      className="w-screen h-screen border-0"
      title="App"
      sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
    />
  );
}
