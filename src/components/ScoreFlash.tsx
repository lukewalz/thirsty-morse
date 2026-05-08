import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface Props {
  value: string | number;
  className?: string;
}

/** Wraps a score so any change triggers a brief accent flash. */
export default function ScoreFlash({ value, className }: Props) {
  const prev = useRef(value);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 700);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={clsx(
        "inline-block rounded px-1 transition-colors duration-300",
        flashing ? "bg-accent/25 text-accent" : "bg-transparent",
        className,
      )}
    >
      {value}
    </span>
  );
}
