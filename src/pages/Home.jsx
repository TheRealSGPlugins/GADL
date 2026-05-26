import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Code2, Users, BookOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Code2, title: "SDK & Tooling", desc: "Comprehensive SDK documentation with copy-paste code snippets for rapid automation development." },
  { icon: Users, title: "Community Forum", desc: "Connect with fellow developers, ask questions, and share your automation techniques." },
  { icon: BookOpen, title: "Learning Paths", desc: "Structured guides from beginner to advanced game automation concepts." },
  { icon: Zap, title: "Live Examples", desc: "Interactive code examples you can modify and test in real-time." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-6">
              <Zap className="w-3.5 h-3.5" /> GAME AUTOMATION DEV
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              GAME AUTOMATION<br /><span className="text-accent">LEARNING ZONE</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              The definitive learning space for Game Automation Development. Master SDKs, build tools, and connect with a community of builders.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/docs"
                className="group inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20"
              >
                Start Learning
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/forum"
                className="inline-flex items-center gap-2.5 bg-card hover:bg-secondary text-foreground font-semibold px-7 py-3.5 rounded-2xl border border-border transition-all duration-200 hover:scale-[1.02]"
              >
                Join Community
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl" />
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 font-mono text-sm">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <pre className="text-chart-2 leading-relaxed overflow-x-auto"><code>{`import { GameEngine } from '@gadl/core';

const bot = new GameEngine({
  target: 'world-server-01',
  mode: 'automation',
  precision: 0.98
});

await bot.initialize();
await bot.execute('harvest_loop', {
  interval: 2500,
  safeMode: true
});

console.log('✓ Automation active');`}</code></pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Everything You Need
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-md mx-auto">
              Tools, docs, and community — all in one place.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="group bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-heading font-bold text-foreground"><span className="text-accent">G</span>ADL<span className="text-accent">.</span></span>
          <span>© 2026 Game Automation Dev Learningspace</span>
        </div>
      </footer>
    </div>
  );
}
