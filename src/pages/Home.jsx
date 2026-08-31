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

const HERO_BG = `${import.meta.env.BASE_URL}omnirune-background.svg`;

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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="min-h-screen pt-16">
        <section
          className="relative min-h-[1050px] flex items-center overflow-hidden py-20 md:py-24"
          data-testid="hero-section"
        >
          <div className="absolute inset-0 bg-black" />

          <img
            src={HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-45 opduel-bg-pulse"
          />

          <div className="absolute inset-0 opduel-white-pulse" />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8 flex justify-center">
                <div className="absolute inset-0 bg-blue-500/20 blur-[90px] rounded-full scale-75" />

                <OmniRuneLogo
                  className="relative z-10 w-[340px] sm:w-[520px] md:w-[720px] lg:w-[860px] max-w-full object-contain opacity-90 drop-shadow-[0_0_36px_rgba(0,110,255,0.55)]"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                    WebkitMaskComposite: "source-in",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                    maskComposite: "intersect",
                  }}
                />
              </div>

              <h1 className="font-heading font-black text-2xl md:text-3xl tracking-[0.18em] uppercase text-white mb-4">
                THE ULTIMATE <span className="text-blue-500">HEADLESS OSRS</span> NATIVE CLIENT
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-8">
                Powerful. Stable. Native. Built for serious OSRS automation.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/download"
                  className="btn-neon-blue text-sm inline-flex items-center gap-2"
                >
                  <Download size={16} /> Download Now
                </Link>

                <Link
                  to="/docs"
                  className="btn-outline-blue text-sm inline-flex items-center gap-2"
                >
                  <BookOpen size={16} /> View Documentation
                </Link>
              </div>

              <div
                id="features"
                className="mt-10 grid w-full max-w-[1220px] grid-cols-1 overflow-hidden rounded-2xl border border-blue-500/20 bg-black/55 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4"
              >
                {highlights.map((item, index) => (
                  <div
                    key={item.title}
                    className={`flex min-h-[92px] items-center gap-4 px-7 py-5 ${
                      index !== highlights.length - 1
                        ? "lg:border-r lg:border-blue-400/10"
                        : ""
                    }`}
                  >
                    <item.icon className="h-8 w-8 shrink-0 text-blue-500" strokeWidth={1.9} />
                    <div className="text-left">
                      <div className="text-sm font-black uppercase tracking-[0.08em] text-white">
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
