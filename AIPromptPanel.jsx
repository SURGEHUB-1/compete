import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Send, Loader2 } from "lucide-react";

const languages = [
  { value: "html_css_js", label: "HTML / CSS / JS" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
  { value: "python_flask", label: "Python (Flask)" },
  { value: "python_django", label: "Python (Django)" },
  { value: "nodejs", label: "Node.js" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby on Rails" },
  { value: "nextjs", label: "Next.js" },
  { value: "angular", label: "Angular" },
];

const difficulties = [
  { value: "beginner", label: "Beginner", desc: "Simple, minimal features" },
  { value: "intermediate", label: "Intermediate", desc: "Standard app with good UX" },
  { value: "advanced", label: "Advanced", desc: "Complex features & patterns" },
  { value: "expert", label: "Expert", desc: "Production-grade, full-stack" },
];

export default function AIPromptPanel({ onGenerate, isGenerating, promptHistory }) {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("html_css_js");
  const [difficulty, setDifficulty] = useState("intermediate");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate({ prompt: prompt.trim(), language, difficulty });
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Prompt history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(!promptHistory || promptHistory.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Describe your app</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Tell the AI what you want to build. Be as detailed or as vague as you want — it'll figure it out.
            </p>
          </div>
        )}
        {promptHistory?.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border/50">
            <p className="text-sm">{item.prompt}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(item.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="border-t border-border/50 p-4 space-y-3">
        <div className="flex gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="flex-1 h-9 text-xs bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(l => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="flex-1 h-9 text-xs bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(d => (
                <SelectItem key={d.value} value={d.value}>
                  <span>{d.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build me a todo app with dark mode..."
            className="min-h-[60px] max-h-[120px] bg-secondary/50 border-border/50 text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="bg-primary hover:bg-primary/90 px-3 self-end"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
