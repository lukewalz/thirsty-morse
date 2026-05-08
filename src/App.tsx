import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import ParlaySlip from "./components/ParlaySlip";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Matchup from "./pages/Matchup";
import History from "./pages/History";

export default function App() {
  return (
    <div className="min-h-full bg-surface-2">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-10 pb-32">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games/:league" element={<Games />} />
          <Route path="/games/:league/:gameId" element={<Matchup />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ParlaySlip />
      <footer className="border-t border-line bg-surface py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
        Live data via ESPN public APIs · Wagers stored locally · No real money
      </footer>
    </div>
  );
}
