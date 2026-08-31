import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import OmniRuneLogo from "../components/OmniRuneLogo";
import {
  BookOpen,
  Download,
  ShieldCheck,
  Zap,
  LockKeyhole,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: ShieldCheck,
    title: "NATIVE",
    desc: "Direct headless runtime",
  },
  {
    icon: Zap,
    title: "POWERFUL",
    desc: "Built around Omni V2",
  },
  {
    icon: LockKeyhole,
    title: "HEADLESS",
    desc: "No graphical client required",
  },
  {
    icon: Users,
    title: "SCRIPTABLE",
    desc: "Lua and live API tooling",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-body text-white overflow-hidden">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-[#01040a] pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_39%,rgba(0,92,255,0.18),transparent_32%),linear-gradient(180deg,#01040a_0%,#020817_48%,#01040a_100%)]" />
        <div className="absolute -left-32 top-[42%] h-[520px] w-[520px] rounded-full bg-blue-600/22 blur-[120px]" />
        <div className="absolute -right-32 top-[42%] h-[520px] w-[520px] rounded-full bg-cyan-500/18 blur-[120px]" />
        <div className="absolute left-1/2 top-[34%] h-[380px] w-[760px] max-w-[90vw] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(0,0,0,0.38)_78%,rgba(0,0,0,0.92)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col px-5 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-col items-center justify-center pt-7 text-center sm:pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative flex w-full justify-center"
            >
              <div className="absolute left-1/2 top-1/2 h-[250px] w-[680px] max-w-[86vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/13 blur-[85px]" />
              <OmniRuneLogo className="relative z-10 w-[min(88vw,780px)] select-none drop-shadow-[0_0_14px_rgba(255,255,255,0.14)] drop-shadow-[0_0_30px_rgba(0,102,255,0.34)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mx-auto -mt-4 max-w-5xl"
            >
              <h1 className="font-heading text-[clamp(1.35rem,2.6vw,2.35rem)] font-black uppercase tracking-[0.16em] text-white">
                THE ULTIMATE <span className="text-blue-400">HEADLESS OSRS</span> NATIVE CLIENT
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
                Native headless OSRS runtime, Omni V2 scripting, live navigation, and development tooling in one client.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/download"
                  className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-md bg-blue-600 px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_0_26px_rgba(37,99,235,0.30)] transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  <Download className="h-4 w-4" />
                  Download Now
                </Link>

                <Link
                  to="/docs"
                  className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-md border border-blue-500/70 bg-black/35 px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-blue-500/10"
                >
                  <BookOpen className="h-4 w-4" />
                  View Documentation
                </Link>
              </div>
            </motion.div>
          </div>

          <div
            id="features"
            className="mx-auto mt-7 grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-blue-500/20 bg-[#020713]/78 shadow-[0_18px_70px_-42px_rgba(0,102,255,0.65)] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-center gap-4 px-7 py-5 ${index !== highlights.length - 1 ? "lg:border-r lg:border-blue-400/10" : ""}`}
              >
                <item.icon className="h-8 w-8 shrink-0 text-blue-500" strokeWidth={1.8} />
                <div className="text-left">
                  <div className="text-sm font-black tracking-[0.08em] text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
