import { Link, useLocation } from "react-router-dom";
import { Zap, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Polygon<span className="text-primary">Labs</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/projects">
            <Button
              variant={isActive("/projects") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2 text-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </Button>
          </Link>
          <Link to="/builder">
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New App</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
