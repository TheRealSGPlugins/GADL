import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Download, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/docs", label: "Docs" },
    { to: "/map", label: "Map" },
    { to: "/updates", label: "Updates" },
    { to: "/achievements", label: "Achievements" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-blue-400/10 bg-[#030711]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-6">
        <Link to="/" className="group flex items-center">
          <span className="font-heading text-xl font-black italic tracking-[-0.03em] text-white transition group-hover:text-blue-100">
            OMNI<span className="text-blue-400">RUNE</span>
          </span>
        </Link>

        <div className="hidden items-stretch self-stretch md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex items-center px-4 text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <div className="flex items-center gap-2 border-r border-white/10 pr-3">
              <img src={user.avatar} alt="" className="h-7 w-7 rounded-full ring-1 ring-blue-400/30" />
              <span className="max-w-32 truncate text-sm font-medium text-slate-300">
                {user.global_name || user.username}
              </span>
              <button
                onClick={logout}
                className="ml-1 text-slate-500 transition hover:text-white"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {!user && (
            <Link to="/login" className="text-sm font-semibold text-slate-300 transition hover:text-white">
              Sign in
            </Link>
          )}

          <Link
            to="/download"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.22)] transition hover:bg-blue-500"
          >
            <Download className="h-4 w-4" />
            Download
          </Link>
        </div>

        <button
          className="rounded-lg border border-blue-400/15 bg-blue-500/[0.05] p-2 text-white md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-blue-400/10 bg-[#050a12] px-5 pb-5 pt-3 md:hidden">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive(link.to)
                    ? "bg-blue-500/10 text-blue-300"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <Link
              to="/download"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Download className="h-4 w-4" />
              Download
            </Link>
            {!user && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block px-3 py-2 text-center text-sm font-semibold text-slate-400"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
