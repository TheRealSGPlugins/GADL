import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { GitCommit, GitBranch, ExternalLink, Loader2 } from "lucide-react";

// Pulls the latest commits straight from the GitHub repo so Updates stays
// in sync with the project automatically.
const REPO = "TheRealSGPlugins/GADL";

function timeAgo(iso) {
  const d = new Date(iso);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, s] of units) {
    const v = Math.floor(secs / s);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function Updates() {
  const [commits, setCommits] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${REPO}/commits?per_page=20`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data = await res.json();
        if (!active) return;
        setCommits(Array.isArray(data) ? data : []);
        setStatus("ok");
      } catch (e) {
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
            Every change shipping into OmniRune, pulled live from the project
            repository.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {status === "loading" && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-20">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading latest commits…
            </div>
          )}

          {status === "error" && (
            <div className="omni-card p-8 text-center text-muted-foreground">
              Couldn't reach the repository feed right now.{" "}
              <a
                href={`https://github.com/${REPO}/commits`}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                View commits on GitHub
              </a>
            </div>
          )}

          {status === "ok" && (
            <ol className="relative border-l border-border/70 ml-3 space-y-6">
              {commits.map((c, i) => {
                const msg = c.commit?.message?.split("\n")[0] || "Update";
                const author =
                  c.author?.login || c.commit?.author?.name || "unknown";
                const when = c.commit?.author?.date;
                return (
                  <motion.li
                    key={c.sha}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                    className="ml-6"
                  >
                    <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-accent/20 ring-4 ring-background">
                      <GitCommit className="w-3 h-3 text-accent" />
                    </span>
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block omni-card p-4 hover:border-accent/40 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium leading-snug">{msg}</p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/60 shrink-0 group-hover:text-accent transition-colors" />
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">{c.sha.slice(0, 7)}</span>
                        <span>·</span>
                        <span>{author}</span>
                        {when && (
                          <>
                            <span>·</span>
                            <span>{timeAgo(when)}</span>
                          </>
                        )}
                      </div>
                    </a>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
