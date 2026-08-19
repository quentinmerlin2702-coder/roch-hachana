"use client";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gold-300/60 bg-cream-50">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-garnet-700 transition hover:bg-gold-50 active:scale-95 disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-8 text-center text-base font-semibold text-garnet-900 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-garnet-700 transition hover:bg-gold-50 active:scale-95 disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
