import { Link, useLocation } from "react-router-dom";
import { Download, LogIn, LogOut, Menu, MonitorCog, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const CONTROL_PANEL_URL = "https://omnirune-control.onrender.com";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/#features", label: "Features", anchor: true },
    { to: "/download", label: "Download" },
    { to: "/docs", label: "Docs" },
    { to: "/updates", label: "Updates" },
    { to: "/map", label: "Map", nativeViewer: true },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navItem = (link, mobile = false) => {
    const classes = mobile
      ? "block rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-slate-300 hover:bg-white/[0.04] hover:text-white"
      : `relative flex items-center px-5 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors ${
          !link.anchor && isActive(link.to)
            ? "text-blue-400"
            : "text-slate-200 hover:text-white"
        }`;

    if (link.anchor) {
      return (
        <a
          key={link.label}
          href="#features"
          onClick={() => setMenuOpen(false)}
          className={classes}
        >
          {link.label}
        </a>
      );
    }

    if (link.nativeViewer) {
      const viewerBase =
        window.location.hostname.endsWith("github.io") ? "/GADL/map/" : "/map/";

      return (
        <a
          key={link.label}
          href={viewerBase}
          onClick={() => setMenuOpen(false)}
          className={classes}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.to}
        onClick={() => setMenuOpen(false)}
        className={classes}
      >
        {link.label}
        {!mobile && isActive(link.to) && link.to !== "/download" && (
          <span className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
        )}
      </Link>
    );
  };

  const displayName = user?.global_name || user?.username || "Account";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-blue-500/15 bg-[#01040a]/96 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 sm:px-7 lg:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-7 items-center justify-center">
            <span className="absolute h-8 w-5 rotate-45 border-2 border-white shadow-[0_0_9px_rgba(59,130,246,0.75)]" />
            <span className="absolute h-5 w-2 rotate-45 bg-blue-500" />
          </span>
          <span className="font-heading text-[22px] font-black italic tracking-[-0.04em] text-white">
            OMNI<span className="text-blue-500">RUNE</span>
          </span>
        </Link>

        <div className="hidden h-full items-stretch md:flex">
          {links.map((link) => navItem(link))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <a
                href={CONTROL_PANEL_URL}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.07em] text-white shadow-[0_0_22px_rgba(37,99,235,0.28)] transition hover:bg-blue-500"
              >
                <MonitorCog className="h-4 w-4" />
                Control Panel
              </a>
              <span className="max-w-36 truncate text-sm font-semibold text-slate-300">
                {displayName}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md border border-blue-500/25 bg-blue-500/[0.06] px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.07em] text-white transition hover:bg-blue-500/15"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.07em] text-white shadow-[0_0_22px_rgba(37,99,235,0.28)] transition hover:bg-blue-500"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>

        <button
          className="rounded-md border border-blue-500/20 bg-blue-500/[0.06] p-2 text-white md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-blue-500/10 bg-[#01040a] px-5 pb-5 pt-3 md:hidden">
          <div className="space-y-1">{links.map((link) => navItem(link, true))}</div>
          {isAuthenticated ? (
            <div className="mt-3 space-y-2">
              <a
                href={CONTROL_PANEL_URL}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_0_22px_rgba(37,99,235,0.22)]"
              >
                <MonitorCog className="h-4 w-4" />
                Control Panel
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-500/25 bg-blue-500/[0.06] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white"
              >
                <LogOut className="h-4 w-4" />
                Log out {displayName}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
