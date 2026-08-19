type StatusCardProps = {
  label: string;
  value: string;
};

export function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded-card border border-border bg-card p-6">
      <p className="font-mono text-xs tracking-widest text-accent uppercase">
        {label}
      </p>
      <p className="font-heading text-2xl font-bold text-text-primary mt-2">
        {value}
      </p>
    </div>
  );
}