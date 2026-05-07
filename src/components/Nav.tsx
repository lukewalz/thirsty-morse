import { NavLink } from "react-router-dom";
import { useWagers } from "@/store/wagers";

export default function Nav() {
  const pending = useWagers((s) => s.wagers.filter((w) => w.status === "pending").length);

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tracking-tight">
            thirsty<span className="text-accent">.</span>morse
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            sportsbook
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 text-sm">
          <NavItem to="/">Live</NavItem>
          <NavItem to="/games/nba">NBA</NavItem>
          <NavItem to="/games/mens-college-basketball">NCAAM</NavItem>
          <NavItem to="/history">
            History
            {pending > 0 && (
              <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-white">
                {pending}
              </span>
            )}
          </NavItem>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `rounded-md px-3 py-1.5 transition-colors ${
          isActive
            ? "bg-surface-3 text-ink"
            : "text-ink-muted hover:bg-surface-2 hover:text-ink"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
