import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const desktopNavClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 transition ${
      isActive ? "bg-emerald-400/20 text-emerald-300" : "text-white/85 hover:text-emerald-300"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `block rounded-lg px-2 py-1.5 transition ${
      isActive ? "bg-emerald-400/20 text-emerald-300" : "text-white hover:text-emerald-300"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-black/35 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 font-display text-2xl font-semibold tracking-tight text-white">
          Trip Compare <span className="text-emerald-400">AI</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium lg:flex">
          <NavLink className={desktopNavClass} to="/" end>
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              desktopNavClass({ isActive: isActive || pathname.startsWith("/destination/") })
            }
            to="/destinations"
          >
            Destinations
          </NavLink>
          <NavLink className={desktopNavClass} to={isAuthenticated ? "/planner" : "/signup"}>
            Compare
          </NavLink>
          <NavLink className={desktopNavClass} to="/ai-features">
            AI Features
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <input
            type="text"
            placeholder="Search destinations"
            className="w-56 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/70 outline-none ring-2 ring-transparent transition focus:ring-emerald-400"
          />
          <Link
            to={isAuthenticated ? "/planner" : "/signup"}
            className="rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02]"
          >
            Start Your Journey
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="ml-auto rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white lg:hidden"
        >
          Menu
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-black/85 px-4 py-4 text-white lg:hidden">
          <div className="space-y-3 text-sm font-medium">
            <NavLink className={mobileNavClass} to="/" end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => mobileNavClass({ isActive: isActive || pathname.startsWith("/destination/") })}
              to="/destinations"
              onClick={() => setMobileOpen(false)}
            >
              Destinations
            </NavLink>
            <NavLink
              className={mobileNavClass}
              to={isAuthenticated ? "/planner" : "/signup"}
              onClick={() => setMobileOpen(false)}
            >
              Compare
            </NavLink>
            <NavLink className={mobileNavClass} to="/ai-features" onClick={() => setMobileOpen(false)}>
              AI Features
            </NavLink>
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/70 outline-none"
            />
            <Link
              to={isAuthenticated ? "/planner" : "/signup"}
              className="block rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-center text-sm font-semibold text-black"
              onClick={() => setMobileOpen(false)}
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
