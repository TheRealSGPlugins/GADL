import Navbar from "../components/Navbar";
import { MessageSquare } from "lucide-react";

export default function Forum() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <header className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 omni-grid pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <MessageSquare className="w-4 h-4 text-accent" /> Community
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="omni-gradient-text">Forum</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Coming soon — join our Discord in the meantime.
          </p>
        </div>
      </header>
    </div>
  );
}
