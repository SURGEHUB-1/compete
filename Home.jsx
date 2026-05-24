import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Globe, Code2, Sparkles, ArrowRight, Layers, Rocket, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    desc: "Describe what you want. Our AI builds it — any language, any complexity, any framework."
  },
  {
    icon: Globe,
    title: "Custom Domains — Free",
    desc: "Publish to yourname.yourtld — completely custom, completely free. No subdomains, no limits."
  },
  {
    icon: Code2,
    title: "Full Code Control",
    desc: "Edit every line. Real-time preview. Export anytime. Your code, your rules."
  },
  {
    icon: Layers,
    title: "Any Language",
    desc: "React, Vue, Svelte, vanilla JS, Python, Go — generate apps in whatever stack you want."
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    desc: "One click to go live. Your app is published and accessible worldwide in seconds."
  },
  {
    icon: Shield,
    title: "No Account Needed",
    desc: "No sign-up. No email. No BS. Just start building and ship your app."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Build & publish apps with AI — no account required
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Build anything.
              <br />
              <span className="text-primary">Ship everywhere.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Describe your app in plain English. Our AI generates it instantly. 
              Publish to your own custom domain — <span className="text-foreground font-medium">yourname.yourtld</span> — completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/builder">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-13 gap-2 w-full sm:w-auto">
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="text-lg px-8 h-13 w-full sm:w-auto border-border/60">
                  My Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-card border border-border/50">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to build?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              No sign-up. No credit card. Just describe what you want and watch it come to life.
            </p>
            <Link to="/builder">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 h-13 gap-2">
                <Sparkles className="w-5 h-5" />
                Create Your App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">PolygonLabs</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Build, publish, own. No strings attached.
          </p>
        </div>
      </footer>
    </div>
  );
}
