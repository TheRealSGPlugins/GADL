import Navbar from "../components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { Download as DownloadIcon, Lock, ShieldCheck, Loader2 } from "lucide-react";

const DOWNLOAD_URL = "";
const VERSION = "v1";
const FILE_LABEL = "OmniRune Client";

export default function Download() {
  const { user, isAuthenticated, isLoadingAuth, loginWithDiscord } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <DownloadIcon className="h-4 w-4" /> OmniRune Client
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight md:text-6xl">Download OmniRune</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Verify your account and get the latest available client build.
          </p>
        </div>

        <section className="mx-auto max-w-2xl rounded-3xl border border-border/70 bg-card/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          {isLoadingAuth ? (
            <div className="flex min-h-52 items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-accent" /> Checking access…
            </div>
          ) : !isAuthenticated ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Member access required</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Connect Discord to verify your account before the download is shown.
              </p>
              <button onClick={loginWithDiscord} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-accent-foreground transition hover:brightness-110">
                <ShieldCheck className="h-5 w-5" /> Continue with Discord
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Verified</p>
                  <h2 className="mt-1 font-heading text-2xl font-bold">{FILE_LABEL}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Latest build · {VERSION}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">{user?.global_name || user?.username || "member"}</span>
                </div>
              </div>

              <div className="pt-6">
                {DOWNLOAD_URL ? (
                  <a href={DOWNLOAD_URL} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground transition hover:brightness-110">
                    <DownloadIcon className="h-5 w-5" /> Download {VERSION}
                  </a>
                ) : (
                  <div className="rounded-xl border border-border/70 bg-background/40 px-5 py-4 text-center text-sm text-muted-foreground">
                    The download link will appear here when the client build is published.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
