import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  symbol?: string;
  trend?: number; // Percentage change
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function MetricCard({ title, value, symbol, trend, icon, className, loading }: MetricCardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <div className={cn(
      "glass-panel p-6 rounded-2xl relative overflow-hidden group glass-card-hover",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
            {icon || <Activity className="w-4 h-4" />}
          </div>
          <span className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">
            {title}
          </span>
        </div>
        {symbol && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            {symbol}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {loading ? (
          <div className="h-8 w-32 bg-secondary/50 animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {value}
            </h3>
          </div>
        )}

        {trend !== undefined && !loading && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
            <span className="text-muted-foreground ml-1">24h</span>
          </div>
        )}
      </div>
    </div>
  );
}
