import { useEffect } from "react";

export default function MapPage() {
  useEffect(() => {
    const viewerBase =
      window.location.hostname.endsWith("github.io") ? "/GADL/map/" : "/map/";

    window.location.replace(viewerBase);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-blue-500/25 border-t-blue-400" />
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Loading OmniRune 3D world…
        </div>
      </div>
    </div>
  );
}
