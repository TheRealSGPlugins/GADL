import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { GitBranch, Sparkles } from "lucide-react";

// Curated changelog — edit this list to publish release notes.
// Newest first. type: "release" | "improvement" | "fix"
const releases = [
  {
    version: "Site Launch",
    date: "2026-05-31",
    tag: "release",
    notes: [
      "OmniRune documentation, forum, and client download are now live.",
    ],
  },
];

const tagStyles = {
  release: "bg-accent/15 text-accent border-accent/30",
  improvement: "bg-primary/15 text-primary border-primary/30",
  fix: "bg-muted/40 text-muted-foreground border-border",
};

export default function Updates() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <header className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 omni-grid pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <GitBranch className="w-4 h-4 text-accent" /> Changelog
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="omni-gradient-text">Updates</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl">
            Release notes and what's new in OmniRune.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {releases.length === 0 ? (
            <div className="omni-card p-10 text-center text-muted-foreground">
              No updates posted yet.
            </div>
          ) : (
            <ol className="relative border-l border-border/70 ml-3 space-y-8">
              {releases.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                  className="ml-6"
                >
                  <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-accent/20 ring-4 ring-background">
                    <Sparkles className="w-3 h-3 text-accent" />
                  </span>
                  <div className="omni-card p-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-heading text-lg font-bold">{r.version}</h2>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          tagStyles[r.tag] || tagStyles.fix
                        }`}
                      >
                        {r.tag}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {r.date}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                      {r.notes.map((n, j) => (
                        <li key={j}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
