import type { CalculatorMode } from "../../lib/roi-compass/types";

interface ModeToggleProps {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--color-line)] bg-white/80 p-1"
      role="group"
      aria-label="Calculator mode"
    >
      <ModeButton
        active={mode === "simple"}
        onClick={() => onChange("simple")}
        label="Simple"
      />
      <ModeButton
        active={mode === "advanced"}
        onClick={() => onChange("advanced")}
        label="Advanced"
      />
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? "bg-[var(--color-ink)] text-white"
          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      }`}
    >
      {label}
    </button>
  );
}
