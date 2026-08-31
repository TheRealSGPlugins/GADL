import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import OmniRuneLogo from "../components/OmniRuneLogo";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Code2,
  Download,
  MapPinned,
  RadioTower,
  TerminalSquare,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: RadioTower,
    title: "Native Headless",
    desc: "Persistent OSRS sessions with live decoded state and direct native actions.",
  },
  {
    icon: Code2,
    title: "Omni V2 SDK",
    desc: "One live API for players, NPCs, objects, inventory, actions, events, and navigation.",
  },
  {
    icon: TerminalSquare,
    title: "Lua Scripts",
    desc: "Build package scripts with onStart, onTick, onStop, events, and live game state.",
  },
  {
    icon: MapPinned,
    title: "Map & Navigation",
    desc: "Visual coordinates and route tooling built around the OmniRune walker stack.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-hidden">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden border-b border-blue-500/10 bg-[#01040a] px-6 pb-16 pt-20">
        <div className="absolute inset-0 omni-grid pointer-events-none" />
        <div className="omni-hero-glow absolute inset-0" />

        <div className="pointer-events-none absolute left-1/2 top-[43%] z-0 w-[min(1180px,112vw)] -translate-x-1/2 -translate-y-1/2">
          <OmniRuneLogo className="omni-hero-art absolute left-1/2 top-1/2 w-full select-none" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t from-[#01040a] via-[#01040a]/82 to-transparent" />
        <div className="absolute inset-x-0 top-16 z-[1] h-44 bg-gradient-to-b from-[#01040a]/92 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col items-center justify-end pb-[7vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300 sm:text-xs">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400 sm:w-14" />
              Native OSRS Automation
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400 sm:w-14" />
            </div>

            <h1 className="mt-5 font-heading text-3xl font-black tracking-tight text-white drop-shadow-[0_0_18px_rgba(0,145,255,0.18)] sm:text-4xl md:text-5xl">
              THE ULTIMATE HEADLESS OSRS NATIVE CLIENT
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300/85 md:text-lg">
              OmniRune combines the native headless runtime, Omni V2 scripting API,
              live navigation, documentation, and development tools in one project.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                <Download className="h-4 w-4" />
                Download
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-400/35 bg-[#020814]/75 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-blue-400/70 hover:bg-blue-500/10"
              >
                <BookOpen className="h-4 w-4 text-blue-300" />
                Documentation
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#020814]/70 px-6 py-3 text-sm font-bold text-slate-200 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-blue-400/40 hover:text-white"
              >
                <MapPinned className="h-4 w-4 text-blue-300" />
                World Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              <Bot className="h-3.5 w-3.5" />
              OmniRune Platform
            </div>
            <h2 className="mt-5 font-heading text-3xl font-black tracking-tight text-white md:text-5xl">
              Everything connects to the same runtime
            </h2>
            <p className="mt-4 text-base text-slate-400 md:text-lg">
              Build scripts, inspect the world, navigate, test actions, and follow the project from one blue-and-white control surface.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-blue-400/15 bg-[#09111f]/80 p-6 shadow-[0_18px_60px_-35px_rgba(0,145,255,0.55)] transition hover:-translate-y-1 hover:border-blue-400/45"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-50" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <feature.icon className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              to="/docs"
              className="group inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white"
            >
              Start building with OmniRune
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-400/10 bg-[#050a12]/80 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <span className="font-heading font-bold tracking-wide text-white">
            OMNI<span className="text-blue-400">RUNE</span>
          </span>
          <span>© {new Date().getFullYear()} OmniRune.</span>
        </div>
      </footer>
    </div>
  );
}
