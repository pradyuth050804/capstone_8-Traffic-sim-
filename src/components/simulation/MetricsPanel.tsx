import { useState, useEffect } from "react";
import { SimulationState, SimulationConfig } from "@/pages/Simulation";
import { Gauge, Clock, AlertTriangle, TrendingUp, Activity, Wifi, WifiOff, Timer } from "lucide-react";

interface MetricsPanelProps {
  simulationState: SimulationState;
  config?: SimulationConfig;
  predictedCongestion?: number | null;
  apiConnected?: boolean;
  routeStats?: { distance: number; duration: number } | null;
}

const MetricsPanel = ({ simulationState, config, predictedCongestion, apiConnected, routeStats }: MetricsPanelProps) => {
  const [metrics, setMetrics] = useState({
    avgSpeed: 0,
    congestionLevel: 0,
    delay: 0,
    baseTravelTime: 0,
    adjustedTravelTime: 0,
    throughput: 0,
  });

  useEffect(() => {
    if (predictedCongestion === null || predictedCongestion === undefined || !routeStats) return;

    const congestionPercent = Math.round(predictedCongestion * 100);
    const baseMins = routeStats.duration / 60;
    const adjustedMins = baseMins * (1 + predictedCongestion);
    const delayMins = adjustedMins - baseMins;
    const avgSpeed = Math.round((routeStats.distance / (routeStats.duration * (1 + predictedCongestion))) * 3.6);
    const throughput = Math.round(1800 * (1 - predictedCongestion * 0.6));

    setMetrics({
      avgSpeed,
      congestionLevel: congestionPercent,
      delay: delayMins,
      baseTravelTime: baseMins,
      adjustedTravelTime: adjustedMins,
      throughput,
    });
  }, [predictedCongestion, routeStats]);

  const getCongestionColor = (level: number) => {
    if (level > 60) return "text-red-400";
    if (level > 40) return "text-amber-400";
    return "text-emerald-400";
  };

  const getCongestionBg = (level: number) => {
    if (level > 60) return "bg-red-500/10";
    if (level > 40) return "bg-amber-500/10";
    return "bg-emerald-500/10";
  };

  const metricItems = [
    {
      icon: Gauge,
      label: "Avg Speed",
      value: `${Math.round(metrics.avgSpeed)}`,
      unit: "km/h",
    },
    {
      icon: TrendingUp,
      label: "Congestion",
      value: `${Math.round(metrics.congestionLevel)}%`,
      unit: null,
      highlight: true,
    },
    {
      icon: Timer,
      label: "Base Time",
      value: metrics.baseTravelTime.toFixed(1),
      unit: "min",
    },
    {
      icon: Clock,
      label: "Adj. Time",
      value: metrics.adjustedTravelTime.toFixed(1),
      unit: "min",
    },
    {
      icon: AlertTriangle,
      label: "Delay",
      value: `+${metrics.delay.toFixed(1)}`,
      unit: "min",
    },
    {
      icon: Activity,
      label: "Throughput",
      value: `${Math.round(metrics.throughput)}`,
      unit: "veh/hr",
    },
  ];

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Real-time Metrics</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${apiConnected ? "bg-primary/10" : "bg-muted"}`}>
            {apiConnected ? (
              <Wifi className="w-3 h-3 text-primary" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className={`text-[10px] font-medium ${apiConnected ? "text-primary" : "text-muted-foreground"}`}>
              {apiConnected ? "ML" : "OFFLINE"}
            </span>
          </div>
          {simulationState === "running" && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {metricItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
            </div>
            {item.highlight ? (
              <div className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 ${getCongestionBg(metrics.congestionLevel)}`}>
                <p className={`text-xl font-bold ${getCongestionColor(metrics.congestionLevel)}`}>
                  {item.value}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-foreground">{item.value}</p>
            )}
            {item.unit && <p className="text-[10px] text-muted-foreground">{item.unit}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsPanel;
