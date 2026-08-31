import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Navbar from "../components/Navbar";
import { Crosshair, LoaderCircle, MapPinned, MousePointer2 } from "lucide-react";

const MAP_VERSION = "2026-07-29_a";
const MAP_ID = -1;
const START_X = 3242;
const START_Y = 3202;
const MIN_ZOOM = -3;
const MAX_ZOOM = 5;
const MAX_NATIVE_ZOOM = 3;

function tileCoordinates(coords) {
  // With L.CRS.Simple, RuneScape game coordinates line up with the
  // wiki tile grid automatically:
  //   zoom 2: 3200 / 64 = region 50
  // Leaflet's Y tile coordinate is negative because north is positive
  // in RuneScape. The wiki filename wants the positive bottom-left
  // tile index, which is -y - 1.
  return {
    x: coords.x,
    negativeY: -coords.y - 1,
  };
}

class RuneScapeGridLayer extends L.GridLayer {
  createTile(coords, done) {
    const tile = document.createElement("img");
    tile.alt = "";
    tile.setAttribute("role", "presentation");
    tile.width = 256;
    tile.height = 256;
    tile.style.width = "256px";
    tile.style.height = "256px";

    const { x, negativeY } = tileCoordinates(coords);
    const plane = this.options.plane ?? 0;

    const url =
      `https://maps.runescape.wiki/osrs/versions/${MAP_VERSION}/tiles/rendered/${MAP_ID}/${coords.z}/${plane}_${x}_${negativeY}.png`;

    let attempts = 0;
    const maxAttempts = 3;

    tile.crossOrigin = "anonymous";
    tile.onload = () => done(null, tile);
    tile.onerror = () => {
      attempts += 1;

      if (attempts >= maxAttempts) {
        done(new Error(`OSRS map tile failed to load: ${url}`), tile);
        return;
      }

      // A transient CDN failure should not leave a permanent black square.
      window.setTimeout(() => {
        tile.src = `${url}?retry=${attempts}`;
      }, 150 * attempts);
    };

    tile.src = url;

    return tile;
  }
}

function RuneScapeTiles({ plane, onStateChange }) {
  const map = useMap();

  useEffect(() => {
    let loadedTiles = 0;
    let failedTiles = 0;

    const layer = new RuneScapeGridLayer({
      plane,
      tileSize: 256,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxNativeZoom: MAX_NATIVE_ZOOM,
      keepBuffer: 3,
      updateWhenIdle: false,
      updateWhenZooming: false,
      bounds: L.latLngBounds([0, 0], [12800, 12800]),
      noWrap: true,
      attribution:
        '&copy; <a href="https://oldschool.runescape.wiki/">OSRS Wiki</a> / Jagex map data',
    });

    layer.on("loading", () => {
      if (loadedTiles === 0) onStateChange("loading");
    });

    layer.on("tileload", () => {
      loadedTiles += 1;
      onStateChange("ready");
    });

    layer.on("tileerror", () => {
      failedTiles += 1;
      if (loadedTiles === 0 && failedTiles >= 6) {
        onStateChange("error");
      }
    });

    layer.addTo(map);

    return () => {
      layer.off();
      map.removeLayer(layer);
    };
  }, [map, plane, onStateChange]);

  return null;
}

function CoordinateTracker({ onHover, onSelect }) {
  useMapEvents({
    mousemove(event) {
      onHover({
        x: Math.round(event.latlng.lng),
        y: Math.round(event.latlng.lat),
      });
    },
    mouseout() {
      onHover(null);
    },
    click(event) {
      onSelect({
        x: Math.round(event.latlng.lng),
        y: Math.round(event.latlng.lat),
      });
    },
  });

  return null;
}

function RecenterButton() {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => map.setView([START_Y, START_X], 2)}
      className="absolute right-4 top-4 z-[500] inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-black/80 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md hover:border-blue-400/60 hover:bg-slate-950"
    >
      <Crosshair className="h-4 w-4 text-blue-400" />
      Reset view
    </button>
  );
}

export default function MapPage() {
  const [plane, setPlane] = useState(0);
  const [tileState, setTileState] = useState("loading");
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState({
    x: START_X,
    y: START_Y,
  });

  const status = useMemo(() => {
    if (tileState === "ready") {
      return {
        label: "Map ready",
        className: "text-emerald-300",
      };
    }

    if (tileState === "error") {
      return {
        label: "World map tiles failed to load",
        className: "text-amber-300",
      };
    }

    return {
      label: "Loading map tiles",
      className: "text-blue-300",
    };
  }, [tileState]);

  return (
    <div className="min-h-screen bg-black font-body text-white">
      <Navbar />

      <main className="flex h-screen flex-col pt-16">
        <div className="border-b border-blue-500/15 bg-[#03070d]/95 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <MapPinned className="h-4 w-4 text-blue-400" />
              </div>

              <div className="min-w-0">
                <h1 className="font-heading text-base font-bold md:text-lg">
                  OmniRune World Map
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {tileState === "loading" && (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-400" />
                  )}
                  <span className={status.className}>{status.label}</span>
                  <span className="text-slate-600">•</span>
                  <span>Full Map</span>
                  <span className="text-slate-600">•</span>
                  <span>{MAP_VERSION}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-300 sm:flex">
                <MousePointer2 className="h-3.5 w-3.5 text-blue-400" />
                {hovered
                  ? `X ${hovered.x} · Y ${hovered.y}`
                  : `Selected X ${selected.x} · Y ${selected.y}`}
              </div>

              <div className="flex overflow-hidden rounded-lg border border-blue-500/20 bg-black/50">
                {[0, 1, 2, 3].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTileState("loading");
                      setPlane(value);
                    }}
                    className={`min-w-10 px-3 py-2 text-xs font-bold transition-colors ${
                      plane === value
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-blue-500/10 hover:text-white"
                    }`}
                    title={`Plane ${value}`}
                  >
                    P{value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#02050a]">
          <MapContainer
            center={[START_Y, START_X]}
            zoom={2}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            zoomSnap={1}
            zoomDelta={1}
            crs={L.CRS.Simple}
            attributionControl
            preferCanvas
            className="h-full w-full bg-[#02050a]"
          >
            <RuneScapeTiles plane={plane} onStateChange={setTileState} />
            <CoordinateTracker onHover={setHovered} onSelect={setSelected} />
            <RecenterButton />

            <CircleMarker
              center={[selected.y, selected.x]}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: "#1685ff",
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="font-mono text-xs">
                  <strong>Selected tile</strong>
                  <br />
                  X: {selected.x}
                  <br />
                  Y: {selected.y}
                  <br />
                  Plane: {plane}
                </div>
              </Popup>
            </CircleMarker>
          </MapContainer>

          <div className="pointer-events-none absolute bottom-5 left-1/2 z-[500] -translate-x-1/2 rounded-xl border border-blue-500/20 bg-black/80 px-4 py-2 text-center text-xs text-slate-300 shadow-2xl backdrop-blur-md">
            Click any square to capture its OSRS coordinate
          </div>
        </div>
      </main>
    </div>
  );
}
