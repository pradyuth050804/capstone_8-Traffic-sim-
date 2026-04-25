import { ArrowRight, TrendingUp, TrendingDown, Equal } from "lucide-react";

interface ScenarioComparisonProps {
  normalCongestion: number | null;
  scenarioCongestion: number | null;
  baseDuration: number; // seconds
  weatherFactor: number;
  eventFactor: number;
}

const ScenarioComparison = ({
  normalCongestion,
  scenarioCongestion,
  baseDuration,
  weatherFactor,
  eventFactor,
}: ScenarioComparisonProps) => {
  if (normalCongestion === null || scenarioCongestion === null) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
        <h3 className="font-semibold text-sm text-foreground mb-2">Normal vs Scenario</h3>
        <p className="text-xs text-muted-foreground">Waiting for predictions...</p>
      </div>
    );
  }

  const normalPct = Math.round(normalCongestion * 100);
  const scenarioPct = Math.round(scenarioCongestion * 100);
  const diff = scenarioPct - normalPct;

  const normalTime = (baseDuration / 60) * (1 + normalCongestion);
  const scenarioTime = (baseDuration / 60) * (1 + scenarioCongestion);
  const timeDiff = scenarioTime - normalTime;

  const getColor = (pct: number) => {
    if (pct > 70) return "text-red-400";
    if (pct > 40) return "text-amber-400";
    return "text-emerald-400";
  };

  const getBg = (pct: number) => {
    if (pct > 70) return "bg-red-500/10 border-red-500/20";
    if (pct > 40) return "bg-amber-500/10 border-amber-500/20";
    return "bg-emerald-500/10 border-emerald-500/20";
  };

  const isWorse = diff > 0;
  const isSame = diff === 0;

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
          <span className="text-[10px]">⚡</span>
        </div>
        <h3 className="font-semibold text-sm text-foreground">Normal vs Scenario</h3>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3 mb-3">
        {/* Normal side */}
        <div className={`text-center p-3 rounded-lg border ${getBg(normalPct)}`}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Normal</p>
          <p className={`text-2xl font-bold tabular-nums ${getColor(normalPct)}`}>{normalPct}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{normalTime.toFixed(1)} min</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Scenario side */}
        <div className={`text-center p-3 rounded-lg border ${getBg(scenarioPct)}`}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Scenario</p>
          <p className={`text-2xl font-bold tabular-nums ${getColor(scenarioPct)}`}>{scenarioPct}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{scenarioTime.toFixed(1)} min</p>
        </div>
      </div>

      {/* Diff badge */}
      <div className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${
        isSame ? "bg-muted/50 border-border" :
        isWorse ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"
      }`}>
        {isSame ? (
          <Equal className="w-3.5 h-3.5 text-muted-foreground" />
        ) : isWorse ? (
          <TrendingUp className="w-3.5 h-3.5 text-red-400" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span className={`text-xs font-semibold ${
          isSame ? "text-muted-foreground" : isWorse ? "text-red-400" : "text-emerald-400"
        }`}>
          {isSame
            ? "No change"
            : `${isWorse ? "+" : ""}${diff}% congestion · ${timeDiff > 0 ? "+" : ""}${timeDiff.toFixed(1)} min`
          }
        </span>
      </div>

      {/* Factor breakdown */}
      {(weatherFactor > 1 || eventFactor > 1) && (
        <div className="mt-3 pt-2 border-t border-border space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5">Applied multipliers</p>
          {weatherFactor > 1 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weather impact</span>
              <span className="font-medium text-cyan-400">×{weatherFactor.toFixed(1)}</span>
            </div>
          )}
          {eventFactor > 1 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Event impact</span>
              <span className="font-medium text-rose-400">×{eventFactor.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioComparison;
