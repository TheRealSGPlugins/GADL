import { useState } from "react";
import Navbar from "../components/Navbar";
import { BookOpen, ChevronRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const sections = [
  {
    id: "overview",
    label: "Overview",
    title: "OmniRune SDK",
    description: "The documentation is being consolidated around the native client, live game state, navigation, and scripting interfaces.",
    points: ["Native client state", "Collision-aware navigation", "Lua scripting", "Runtime services"],
  },
  {
    id: "navigation",
    label: "Navigation",
    title: "Navigation",
    description: "Navigation accepts world coordinates and routes through the walker instead of hard-coding movement paths inside scripts.",
    code: `omni.navigation.walkTo(3231, 3218)`,
    points: ["World-coordinate destinations", "Walker-owned routing", "Collision-aware movement", "Readable navigation status"],
  },
  {
    id: "state",
    label: "Game State",
    title: "Live Game State",
    description: "Scripts consume decoded client state through stable SDK services rather than reading renderer or UI internals directly.",
    points: ["Player position", "Inventory state", "NPC and object state", "Runtime status"],
  },
  {
    id: "lua",
    label: "Lua SDK",
    title: "Lua SDK",
    description: "Lua scripts are kept small by exposing game services as direct OmniRune APIs.",
    code: `-- Move to a world tile\nomni.navigation.walkTo(3231, 3218)`,
    points: ["Simple script entry points", "Shared SDK services", "Native runtime integration", "Reusable plugin logic"],
  },
];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  if (!code) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-border/70 bg-black/30">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Example</span>
        <button onClick={copy} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-accent">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-sky-200"><code>{code}</code></pre>
    </div>
  );
}

export default function SDKDocs() {
  const [active, setActive] = useState("overview");
  const section = sections.find((item) => item.id === active) || sections[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28">
        <div className="mb-10 border-b border-border/60 pb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <BookOpen className="h-4 w-4" /> Documentation
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl">OmniRune Docs</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">A focused reference for the parts of OmniRune that scripts and integrations actually use.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside>
            <nav className="rounded-2xl border border-border/70 bg-card/60 p-2 backdrop-blur-xl">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active === item.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </nav>
          </aside>

          <section className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{section.label}</p>
            <h2 className="mt-2 font-heading text-3xl font-black md:text-4xl">{section.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{section.description}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {section.points.map((point) => (
                <div key={point} className="rounded-xl border border-border/60 bg-background/35 px-4 py-3 text-sm font-medium text-foreground/90">
                  {point}
                </div>
              ))}
            </div>

            <CodeBlock code={section.code} />
          </section>
        </div>
      </main>
    </div>
  );
}
