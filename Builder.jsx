import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Eye, Rocket, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getSessionId } from "@/lib/sessionId";
import AIPromptPanel from "@/components/builder/AIPromptPanel";
import CodeEditor from "@/components/builder/CodeEditor";
import PreviewPane from "@/components/builder/PreviewPane";
import PublishDialog from "@/components/builder/PublishDialog";

export default function Builder() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  const [project, setProject] = useState(null);
  const [code, setCode] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [showPublish, setShowPublish] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing project if ID provided
  useEffect(() => {
    if (projectId) {
      base44.entities.Project.list().then(projects => {
        const p = projects.find(pr => pr.id === projectId);
        if (p) {
          setProject(p);
          setCode(p.code || "");
          setPromptHistory(p.prompt_history || []);
        }
      });
    }
  }, [projectId]);

  const handleGenerate = useCallback(async ({ prompt, language, difficulty }) => {
    setIsGenerating(true);

    const langLabel = {
      html_css_js: "HTML, CSS, and vanilla JavaScript",
      react: "React with inline styles",
      vue: "Vue.js single-file component style",
      svelte: "Svelte component style",
      python_flask: "Python Flask (generate the HTML template)",
      python_django: "Python Django (generate the HTML template)",
      nodejs: "Node.js Express (generate the HTML frontend)",
      go: "Go (generate the HTML frontend)",
      rust: "Rust (generate the HTML frontend)",
      php: "PHP (generate the HTML frontend)",
      ruby: "Ruby on Rails (generate the HTML frontend)",
      nextjs: "Next.js (generate the HTML/React page)",
      angular: "Angular (generate the HTML template)",
    }[language] || "HTML, CSS, and JavaScript";

    const difficultyGuide = {
      beginner: "Keep it simple with minimal features, clean UI, and basic functionality. Good for learning.",
      intermediate: "Standard app with polished UI, good UX patterns, responsive design, and solid functionality.",
      advanced: "Complex features, advanced CSS animations, state management, error handling, and performance optimization.",
      expert: "Production-grade code with advanced architecture, accessibility, testing considerations, security best practices, and enterprise-level patterns.",
    }[difficulty] || "";

    const systemPrompt = `You are an expert app builder. Generate a COMPLETE, SINGLE-FILE HTML application based on the user's request.

IMPORTANT RULES:
- Output ONLY the complete HTML code, nothing else. No markdown, no explanations.
- The code must be a single self-contained HTML file with embedded CSS and JavaScript.
- Use ${langLabel} approach to build it.
- Difficulty level: ${difficulty}. ${difficultyGuide}
- Make the design STUNNING — use modern CSS, gradients, shadows, animations, and a professional color scheme.
- The app must be fully functional with all described features working.
- Use a dark theme by default with vibrant accent colors.
- Make it responsive for all screen sizes.
- Include all interactivity and state management inline.
${code ? `\nThe user already has this existing code. Modify/improve it based on their new request:\n\n${code.substring(0, 3000)}` : ""}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser request: ${prompt}`,
      response_json_schema: {
        type: "object",
        properties: {
          html_code: { type: "string", description: "The complete HTML file content" },
          app_name: { type: "string", description: "A short name for this app" },
          app_description: { type: "string", description: "One sentence description" }
        }
      }
    });

    const generatedCode = result.html_code || "";
    const appName = result.app_name || "Untitled App";
    const appDesc = result.app_description || "";

    setCode(generatedCode);
    setActiveTab("preview");

    const newHistory = [
      ...(promptHistory || []),
      { prompt, timestamp: new Date().toISOString() }
    ];
    setPromptHistory(newHistory);

    // Auto-save project
    const sessionId = getSessionId();
    if (project) {
      await base44.entities.Project.update(project.id, {
        code: generatedCode,
        prompt_history: newHistory,
        language,
        difficulty,
        status: "ready",
        name: project.name === "Untitled App" ? appName : project.name,
        description: appDesc || project.description,
      });
      setProject(prev => ({ ...prev, code: generatedCode, prompt_history: newHistory, status: "ready" }));
    } else {
      const newProject = await base44.entities.Project.create({
        name: appName,
        description: appDesc,
        language,
        difficulty,
        code: generatedCode,
        prompt_history: newHistory,
        status: "ready",
        session_id: sessionId,
      });
      setProject(newProject);
      // Update URL without reload
      window.history.replaceState(null, "", `/builder?project=${newProject.id}`);
    }

    setIsGenerating(false);
    toast.success("App generated!");
  }, [code, project, promptHistory]);

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    await base44.entities.Project.update(project.id, { code });
    setIsSaving(false);
    toast.success("Saved!");
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Left: AI Prompt Panel */}
      <div className="w-80 border-r border-border/50 bg-card/30 flex-shrink-0 hidden md:flex flex-col">
        <div className="px-4 py-3 border-b border-border/50">
          <h2 className="font-semibold text-sm">AI Builder</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {project?.name || "New Project"}
          </p>
        </div>
        <AIPromptPanel
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          promptHistory={promptHistory}
        />
      </div>

      {/* Right: Code + Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/30">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-secondary/50 h-8">
              <TabsTrigger value="preview" className="text-xs h-6 gap-1.5 px-3">
                <Eye className="w-3.5 h-3.5" /> Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs h-6 gap-1.5 px-3">
                <Code2 className="w-3.5 h-3.5" /> Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            {/* Mobile AI trigger */}
            <div className="md:hidden">
              <MobilePromptTrigger
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                promptHistory={promptHistory}
              />
            </div>
            {project && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90"
                  onClick={() => setShowPublish(true)}
                  disabled={!code}
                >
                  <Rocket className="w-3.5 h-3.5" /> Publish
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {activeTab === "preview" ? (
            <PreviewPane code={code} />
          ) : (
            <CodeEditor code={code} onChange={setCode} />
          )}
        </div>
      </div>

      {/* Publish Dialog */}
      {project && (
        <PublishDialog
          open={showPublish}
          onOpenChange={setShowPublish}
          project={project}
          onPublished={(domain) => {
            setProject(prev => ({ ...prev, status: "published", custom_domain: domain }));
          }}
        />
      )}
    </div>
  );
}

// Mobile-only prompt trigger
function MobilePromptTrigger({ onGenerate, isGenerating, promptHistory }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(true)}>
        AI ✨
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <h3 className="font-semibold text-sm">AI Builder</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
          </div>
          <div className="flex-1">
            <AIPromptPanel
              onGenerate={(args) => { onGenerate(args); setOpen(false); }}
              isGenerating={isGenerating}
              promptHistory={promptHistory}
            />
          </div>
        </div>
      )}
    </>
  );
}
