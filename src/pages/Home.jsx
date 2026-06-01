import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BrandMark from "../components/BrandMark";
import {
  ArrowRight,
  Code2,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "SDK & Tooling",
    desc: "Documented SDK with copy-paste snippets for building OSRS automation fast.",
  },
  {
    icon: BookOpen,
    title: "Living Documentation",
    desc: "Up-to-date docs on the client and the work shipping into it, kept in sync with the repo.",
  },
  {
    icon: Trophy,
    title: "Updates & Achievements",
    desc: "Track every release, milestone, and win as the project evolves.",
  },
  {
    icon: Users,
    title: "Community Forum",
    desc: "Ask questions, share techniques, and hold discussions with other builders.",
  },
];

// Decorative corner markers used in the reference design
function Marker({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3.5 h-3.5 text-accent/40 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3 3 L13 13 M13 3 L3 13" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-hidden">
      <Navbar />

      {/* ===== Hero ===== */}
      <section className="relative pt-28 pb-40 px-6">
        <div className="absolute inset-0 omni-grid pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-16"
          >
            <BrandMark className="w-14 h-14" />
          </motion.div>

          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/50" />
            Game Automation SDK
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/50" />
          </motion.div>

          {/* relative wrapper for markers */}
          <div className="relative">
            <Marker className="absolute -left-6 -top-2 hidden sm:block" />
            <Marker className="absolute -right-6 -top-2 hidden sm:block" />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-heading font-extrabold tracking-tight leading-[0.95] text-7xl sm:text-8xl md:text-[8.5rem] omni-gradient-text"
            >
              OmniRune
            </motion.h1>

            <Marker className="absolute -left-6 -bottom-4 hidden sm:block" />
            <Marker className="absolute -right-6 -bottom-4 hidden sm:block" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            The documentation, updates, and community home for the OmniRune
            automation project. Read the docs, follow every release, and join the
            discussion.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/docs"
              className="group inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-primary/20"
            >
              Read the Docs
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/forum"
              className="inline-flex items-center gap-2.5 bg-card/60 hover:bg-secondary text-foreground font-semibold px-7 py-3.5 rounded-full border border-border backdrop-blur-sm transition-all duration-200 hover:scale-[1.03]"
            >
              Join the Forum
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            Built and maintained with continuous updates from the source repo
          </motion.div>
        </div>

        {/* glowing horizon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-48 omni-horizon pointer-events-none" />
      </section>

      {/* ===== Features ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight">
              Everything in one place
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
              Docs, releases, milestones, and community — for the whole project.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="group omni-card p-6 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <BrandMark className="w-7 h-7" />
            <span className="font-heading font-bold text-foreground">
              Omni<span className="text-accent">Rune</span>
            </span>
          </div>
          <span>© {new Date().getFullYear()} OmniRune. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
