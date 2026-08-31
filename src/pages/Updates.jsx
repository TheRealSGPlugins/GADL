import Navbar from "../components/Navbar";
import { GitBranch, Sparkles } from "lucide-react";

const releases = [
  {
    version: "Site Launch",
    date: "2026-05-31",
    notes: ["OmniRune documentation, forum, and client download are now live."],
  },
];

export default function Updates() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="mb-10 border-b border-border/60 pb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <GitBranch className="h-4 w-4" /> Changelog
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl">Updates</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Release notes, site changes, and OmniRune project updates.</p>
        </div>

        <div className="space-y-4">
          {releases.map((release) => (
            <article key={`${release.version}-${release.date}`} className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold">{release.version}</h2>
                    <p className="text-xs text-muted-foreground">Release</p>
                  </div>
                </div>
                <time className="text-sm text-muted-foreground">{release.date}</time>
              </div>
              <div className="mt-5 border-t border-border/50 pt-5">
                {release.notes.map((note) => (
                  <p key={note} className="text-sm leading-7 text-muted-foreground">{note}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
