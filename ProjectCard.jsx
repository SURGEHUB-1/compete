import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Globe, Pencil, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  building: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ready: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function ProjectCard({ project, onDelete }) {
  return (
    <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
      {/* Preview thumbnail */}
      <div className="h-40 bg-secondary/30 border-b border-border/50 overflow-hidden relative">
        {project.code ? (
          <iframe
            srcDoc={project.code}
            className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
            style={{ width: "200%", height: "200%" }}
            title={project.name}
            sandbox=""
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Code2 className="w-8 h-8 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{project.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {project.description || "No description"}
            </p>
          </div>
          <Badge variant="outline" className={`ml-2 text-[10px] shrink-0 ${statusStyles[project.status] || ""}`}>
            {project.status}
          </Badge>
        </div>

        {project.custom_domain && (
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="w-3 h-3 text-accent" />
            <span className="font-mono text-accent">{project.custom_domain}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
