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
    desc: "Packed with Omni V2 tooling",
  },
  {
    icon: LockKeyhole,
    title: "HEADLESS",
    desc: "No graphical client required",
  },
  {
    icon: Users,
    title: "SCRIPTABLE",
    desc: "Lua and live API support",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-black font-body text-white">
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#01030a] pt-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#01030a_0%,#020715_46%,#01030a_100%)]" />

        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_50%_24%,rgba(11,89,255,0.18),transparent_28%),radial-gradient(circle_at_50%_52%,rgba(0,86,255,0.10),transparent_38%)]" />

        <div className="absolute left-[-13rem] top-[34%] h-[620px] w-[620px] rounded-full bg-blue-700/30 blur-[125px]" />
        <div className="absolute left-[-5rem] top-[52%] h-[430px] w-[430px] rounded-full bg-cyan-500/16 blur-[100px]" />
        <div className="absolute right-[-13rem] top-[34%] h-[620px] w-[620px] rounded-full bg-blue-700/30 blur-[125px]" />
        <div className="absolute right-[-5rem] top-[52%] h-[430px] w-[430px] rounded-full bg-cyan-500/16 blur-[100px]" />

        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,transparent_0%,rgba(1,3,10,0.28)_30%,#01030a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.88)_100%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(58,132,255,0.75)_1px,transparent_1.2px)] [background-size:130px_110px] [background-position:40px_20px] [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_86%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1480px] flex-col px-5 pb-8 sm:px-7 lg:px-10">
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mt-2 flex w-full justify-center sm:mt-4"
            >
              <div className="absolute left-1/2 top-1/2 h-[280px] w-[760px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/14 blur-[90px]" />
              <OmniRuneLogo className="relative z-10 w-[min(88vw,790px)] select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.20)] drop-shadow-[0_0_26px_rgba(0,105,255,0.46)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mx-auto -mt-6 max-w-5xl"
            >
              <h1 className="font-heading text-[clamp(1.25rem,2.25vw,2rem)] font-black uppercase tracking-[0.19em] text-white">
                THE ULTIMATE <span className="text-blue-500">HEADLESS OSRS</span> NATIVE CLIENT
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-300 sm:text-[18px]">
                Powerful. Stable. Native. Built for serious OSRS automation.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                <Link
                  to="/download"
                  className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-md bg-[#0c67ff] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.09em] text-white shadow-[0_0_28px_rgba(12,103,255,0.34)] transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  <Download className="h-4 w-4" />
                  Download Now
                </Link>

                <Link
                  to="/docs"
                  className="inline-flex min-w-[285px] items-center justify-center gap-2 rounded-md border border-blue-500 bg-black/35 px-8 py-4 text-sm font-extrabold uppercase tracking-[0.09em] text-white transition hover:-translate-y-0.5 hover:bg-blue-500/10"
                >
                  <BookOpen className="h-4 w-4" />
                  View Documentation
                </Link>
              </div>
            </motion.div>
          </section>

          <section
            id="features"
            className="mx-auto mb-2 mt-8 grid w-full max-w-[1220px] grid-cols-1 overflow-hidden rounded-2xl border border-blue-500/20 bg-[#020714]/88 shadow-[0_15px_55px_-34px_rgba(0,82,255,0.65)] backdrop-blur-lg sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`flex min-h-[92px] items-center gap-4 px-7 py-5 ${index !== highlights.length - 1 ? "lg:border-r lg:border-blue-400/10" : ""}`}
              >
                <item.icon className="h-8 w-8 shrink-0 text-[#0b67ff]" strokeWidth={1.9} />
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-[0.08em] text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
