import Navbar from "../components/Navbar";
import { ExternalLink, MapPinned } from "lucide-react";

const MAP_URL =
  "https://osrs.world/?cx=3242.00&cy=26&cz=3202.00&p=-245&y=1862&v=1";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <main className="pt-16 h-screen flex flex-col">
        <div className="border-b border-border/60 bg-card/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <MapPinned className="w-4.5 h-4.5 text-accent" />
              </div>
              <div className="min-w-0">
                <h1 className="font-heading font-bold text-base md:text-lg">
                  OSRS World Map
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Interactive world view for coordinates and route planning.
                </p>
              </div>
            </div>

            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-accent transition-colors shrink-0"
            >
              Open full map
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-black">
          <iframe
            title="OSRS World Map"
            src={MAP_URL}
            className="w-full h-full border-0"
            loading="eager"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      </main>
    </div>
  );
}
