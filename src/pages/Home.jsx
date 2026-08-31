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

      <section className="relative min-h-[940px] overflow-hidden border-b border-blue-400/10 bg-black px-6 pb-20 pt-24 md:min-h-screen">
        <div className="absolute inset-0 bg-black" />
        <div className="omni-reference-bg absolute inset-0" />
        <div className="omni-reference-beams absolute inset-0" />
        <div className="omni-reference-stars absolute inset-0" />
        <div className="omni-reference-vignette absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[820px] w-full max-w-7xl items-center justify-center md:min-h-[calc(100vh-6rem)]">
          <div className="flex w-full flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative flex w-full justify-center"
            >
              <div className="absolute left-1/2 top-1/2 h-[340px] w-[760px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[110px]" />
              <OmniRuneLogo className="omni-reference-logo relative z-10 w-[min(92vw,900px)] select-none" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mx-auto -mt-3 max-w-4xl"
            >
              <div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-cyan-300 sm:text-xs">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400 sm:w-16" />
                Native OSRS Automation
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400 sm:w-16" />
              </div>

              <h1 className="mt-5 font-heading text-3xl font-black tracking-tight text-white drop-shadow-[0_0_22px_rgba(0,200,255,0.30)] sm:text-4xl md:text-5xl lg:text-6xl">
                THE ULTIMATE HEADLESS OSRS NATIVE CLIENT
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                OmniRune combines the native headless runtime, Omni V2 scripting API,
                live navigation, documentation, and development tools in one project.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/download"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 text-sm font-extrabold text-[#001018] shadow-[0_0_28px_rgba(0,220,255,0.38)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/35 bg-black/45 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-300/70 hover:bg-cyan-400/10"
                >
                  <BookOpen className="h-4 w-4 text-cyan-300" />
                  Documentation
                </Link>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-slate-200 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:text-white"
                >
                  <MapPinned className="h-4 w-4 text-cyan-300" />
                  World Map
                </Link>
              </div>
            </motion.div>
          </div>
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
