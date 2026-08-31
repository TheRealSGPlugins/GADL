import Navbar from "../components/Navbar";
import { MessageSquare } from "lucide-react";

export default function Forum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-6 py-28">
        <section className="w-full rounded-3xl border border-border/70 bg-card/60 p-8 text-center backdrop-blur-xl md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
            <MessageSquare className="h-6 w-6 text-accent" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Community</p>
          <h1 className="mt-2 font-heading text-4xl font-black tracking-tight md:text-5xl">Forum</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            The OmniRune forum is being prepared. Community discussion is handled through Discord for now.
          </p>
        </section>
      </main>
    </div>
  );
}
