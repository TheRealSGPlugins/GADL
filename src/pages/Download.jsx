import Navbar from "../components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Download as DownloadIcon, Lock, ShieldCheck, Loader2 } from "lucide-react";

// Set this to the real client download URL (e.g. a release asset or hosted file).
// Leave empty to show a "coming soon" state.
const DOWNLOAD_URL = "";
const VERSION = "v1";
const FILE_LABEL = "OmniRune Client";

export default function Download() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <header className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 omni-grid pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <DownloadIcon className="w-4 h-4 text-accent" /> Client
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="omni-gradient-text">Download</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Get the latest OmniRune client. Sign in to access your download.
          </p>
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-xl mx-auto">
          {isLoadingAuth ? (
            <div className="omni-card p-10 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Checking access…
            </div>
          ) : !isAuthenticated ? (
            <div className="omni-card p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-xl font-bold">Verification required</h2>
              <p className="mt-2 text-muted-foreground">
                Sign in to verify your access and unlock the client download.
              </p>
              <button
                onClick={() => base44.auth.loginWithProvider("discord", "/download")}
                className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-[1.03]"
              >
                <ShieldCheck className="w-4 h-4" /> Verify with Discord
              </button>
            </div>
          ) : (
            <div className="omni-card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                Verified as{" "}
                <span className="text-foreground font-medium">
                  {user?.full_name || user?.email || "member"}
                </span>
                {user?.role === "admin" && (
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-accent/30 bg-accent/15 text-accent">
                    admin
                  </span>
                )}
              </p>

              <h2 className="mt-4 font-heading text-2xl font-bold">{FILE_LABEL}</h2>
              <p className="text-muted-foreground">{VERSION}</p>

              {DOWNLOAD_URL ? (
                <a
                  href={DOWNLOAD_URL}
                  className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-full transition-all hover:scale-[1.03]"
                >
                  <DownloadIcon className="w-5 h-5" /> Download {VERSION}
                </a>
              ) : (
                <div className="mt-6 inline-flex items-center gap-2 bg-card/60 border border-border text-muted-foreground font-medium px-6 py-3 rounded-full">
                  Download link coming soon
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
