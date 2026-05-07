import clsx from "clsx";

type State = "pre" | "in" | "post" | "won" | "lost" | "push" | "pending";

const STYLES: Record<State, string> = {
  pre: "bg-surface-3 text-ink-muted",
  in: "bg-accent/10 text-accent",
  post: "bg-surface-3 text-ink-muted",
  won: "bg-positive/10 text-positive",
  lost: "bg-negative/10 text-negative",
  push: "bg-surface-3 text-ink-muted",
  pending: "bg-accent/10 text-accent",
};

export default function StateBadge({
  state,
  children,
}: {
  state: State;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        STYLES[state],
      )}
    >
      {children}
    </span>
  );
}
