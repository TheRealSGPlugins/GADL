import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Trophy, Star, Rocket, Target, Award, Flame } from "lucide-react";

// Project milestones. Swap these for live data once the achievements
// source is wired up.
const milestones = [
  {
    icon: Rocket,
    title: "Project Launch",
    desc: "OmniRune kicked off as an open automation project for the community.",
    status: "done",
  },
  {
    icon: Star,
    title: "SDK v1 Released",
    desc: "First documented SDK with the core engine and scripting API.",
    status: "done",
  },
  {
    icon: Target,
    title: "Living Documentation",
    desc: "Docs that stay in sync with the repo on every update.",
    status: "done",
  },
  {
    icon: Flame,
    title: "Community Forum",
    desc: "A place for builders to share techniques and get help.",
    status: "in-progress",
  },
  {
    icon: Award,
    title: "1,000 Members",
    desc: "Grow the community to a thousand active builders.",
    status: "upcoming",
  },
];

const statusStyles = {
  done: "bg-accent/15 text-accent border-accent/30",
  "in-progress": "bg-primary/15 text-primary border-primary/30",
  upcoming: "bg-muted text-muted-foreground border-border",
};

const statusLabel = {
  done: "Achieved",
  "in-progress": "In progress",
  upcoming: "Upcoming",
};

export default function Achievements() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <header className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 omni-grid pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Trophy className="w-4 h-4 text-accent" /> Milestones
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="omni-gradient-text">Achievements</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl">
            Milestones and wins as the OmniRune project grows.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          {milestones.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="omni-card p-6 flex gap-4 items-start"
            >
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-accent/10 flex items-center justify-center">
                <m.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-bold">{m.title}</h3>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyles[m.status]}`}
                  >
                    {statusLabel[m.status]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
