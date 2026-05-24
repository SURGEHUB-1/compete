import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, RotateCcw, ExternalLink } from "lucide-react";

const viewports = [
  { id: "desktop", icon: Monitor, width: "100%" },
  { id: "tablet", icon: Tablet, width: "768px" },
  { id: "mobile", icon: Smartphone, width: "375px" },
];

export default function PreviewPane({ code }) {
  const [viewport, setViewport] = useState("desktop");
  const [key, setKey] = useState(0);

  const currentVP = viewports.find(v => v.id === viewport);

  const openInNewTab = () => {
    const blob = new Blob([code || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50">
        <span className="text-xs text-muted-foreground font-medium">Preview</span>
        <div className="flex items-center gap-1">
          {viewports.map(vp => (
            <Button
              key={vp.id}
              variant={viewport === vp.id ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewport(vp.id)}
            >
              <vp.icon className="w-3.5 h-3.5" />
            </Button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setKey(k => k + 1)}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={openInNewTab}>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-white flex justify-center overflow-auto p-2">
        {code ? (
          <iframe
            key={key}
            srcDoc={code}
            className="border-0 h-full bg-white rounded-lg shadow-inner"
            style={{ width: currentVP.width, maxWidth: "100%" }}
            title="Preview"
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
 
