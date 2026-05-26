import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/docs", label: "SDK Docs" },
    { to: "/forum", label: "Forum" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading font-extrabold text-xl tracking-tight text-foreground">
          <span className="text-accent">G</span>ADL<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(l.to) ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-card/50"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && (
            <button
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 pb-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive(l.to) ? "bg-accent/10 text-accent" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}