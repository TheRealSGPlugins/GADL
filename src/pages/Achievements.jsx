import Navbar from "../components/Navbar";
import { Trophy, Rocket, Star, Target, Flame } from "lucide-react";

const milestones = [
  { icon: Rocket, title: "Project Launch", desc: "OmniRune development kicked off.", status: "Achieved" },
  { icon: Star, title: "SDK v1", desc: "Core SDK structure and documentation established.", status: "Achieved" },
  { icon: Target, title: "3D World Viewer", desc: "Native 3D world rendering with collision-aware movement proofed.", status: "Achieved" },
  { icon: Flame, title: "Continuous Updates", desc: "Ongoing client, map, and SDK improvements.", status: "In progress" },
];

export default function Achievements() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="mb-10 border-b border-border/60 pb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <Trophy className="h-4 w-4" /> Milestones
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl">Achievements</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">A simple record of major OmniRune milestones.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {milestones.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{item.status}</span>
              </div>
              <h2 className="mt-5 font-heading text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
