interface StepMarkerProps {
  step: number;
  label: string;
}

export function StepMarker({ step, label }: StepMarkerProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0">
        {step}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
