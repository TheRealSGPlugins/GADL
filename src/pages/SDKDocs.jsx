import { useState } from "react";
import Navbar from "../components/Navbar";
import { Copy, Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "installation", label: "Installation" },
  { id: "configuration", label: "Configuration" },
  { id: "game-engine", label: "GameEngine API" },
  { id: "automation", label: "Automation Scripts" },
  { id: "events", label: "Event System" },
  { id: "utilities", label: "Utilities" },
];

const docs = {
  "getting-started": {
    title: "Getting Started",
    content: "Welcome to the OmniRune SDK. This guide walks you through the core concepts of game automation development. The SDK provides a robust framework for building, testing, and deploying automation scripts across multiple game environments.",
    code: `// Quick start
import { GameEngine } from '@omnirune/core';

const engine = new GameEngine();
await engine.connect('your-server-id');
console.log('Connected!');`,
  },
  installation: {
    title: "Installation",
    content: "Install the OmniRune SDK via your preferred package manager. The SDK requires Node.js 18+ and supports both ESM and CommonJS module formats.",
    code: `# npm
npm install @omnirune/core @omnirune/cli

# yarn
yarn add @omnirune/core @omnirune/cli

# pnpm
pnpm add @omnirune/core @omnirune/cli`,
  },
  configuration: {
    title: "Configuration",
    content: "Configure your automation environment with a omnirune.config.js file at the project root. This file defines targets, execution modes, safety limits, and logging preferences.",
    code: `// omnirune.config.js
export default {
  target: 'world-server-01',
  mode: 'development',
  safety: {
    maxActionsPerMinute: 60,
    cooldownMs: 1000,
    failsafe: true
  },
  logging: {
    level: 'info',
    output: './logs'
  }
};`,
  },
  "game-engine": {
    title: "GameEngine API",
    content: "The GameEngine class is the primary interface for interacting with game environments. It manages connections, state tracking, and script execution with built-in safety mechanisms.",
    code: `import { GameEngine } from '@omnirune/core';

const engine = new GameEngine({
  target: 'world-server-01',
  mode: 'automation',
  precision: 0.98
});

// Lifecycle methods
await engine.initialize();
await engine.connect();

// State management
const state = engine.getState();
console.log(state.position);  // { x, y, z }
console.log(state.inventory); // Item[]

// Cleanup
await engine.disconnect();`,
  },
  automation: {
    title: "Automation Scripts",
    content: "Build reusable automation scripts with the Script API. Scripts support conditional logic, error recovery, and can be composed together for complex workflows.",
    code: `import { Script, Condition } from '@omnirune/core';

const harvestScript = new Script('harvest_loop')
  .step('navigate', { target: 'field_01' })
  .step('interact', { action: 'harvest' })
  .step('wait', { ms: 2500 })
  .condition(
    Condition.inventoryFull(),
    Script.goto('deposit')
  )
  .loop();

await engine.execute(harvestScript);`,
  },
  events: {
    title: "Event System",
    content: "The event system provides real-time hooks into engine state changes, errors, and custom triggers. Use events for monitoring, logging, and reactive automation patterns.",
    code: `engine.on('stateChange', (prev, next) => {
  console.log('State updated:', next);
});

engine.on('error', (err) => {
  console.error('Engine error:', err.message);
  engine.recover(); // auto-recovery
});

engine.on('scriptComplete', (result) => {
  console.log(\`Script \${result.name} finished\`);
  console.log(\`Actions: \${result.actionCount}\`);
});`,
  },
  utilities: {
    title: "Utilities",
    content: "Helper functions for common automation tasks including timing, random delays, coordinate math, and inventory management.",
    code: `import { delay, randomDelay, distance } from '@omnirune/utils';

// Human-like random delay (800-1200ms)
await randomDelay(800, 1200);

// Calculate distance between points
const d = distance(
  { x: 10, y: 20 },
  { x: 50, y: 60 }
);

// Batch inventory operations
import { Inventory } from '@omnirune/utils';
const filtered = Inventory.filter(items, {
  type: 'resource',
  minQuantity: 5
});`,
  },
};

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-6">
      <div className="bg-background/80 border border-border/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
          <span className="text-xs text-muted-foreground font-mono">snippet</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-chart-2">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function SDKDocs() {
  const [active, setActive] = useState("getting-started");
  const doc = docs[active];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-6 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-20 h-fit">
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Documentation</h3>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active === s.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active === s.id ? "rotate-90 text-accent" : ""}`} />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground font-medium"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 pb-24">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10">
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{doc.title}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed text-base">{doc.content}</p>
              <CodeBlock code={doc.code} />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}