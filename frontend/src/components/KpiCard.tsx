import { ArrowUpRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
}

export function KpiCard({ label, value, change, positive = true, icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 group hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {change && (
          <span className={`flex items-center text-xs font-medium mb-1 ${positive ? "text-secondary" : "text-destructive"}`}>
            <ArrowUpRight className={`h-3 w-3 ${!positive ? "rotate-90" : ""}`} />
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
