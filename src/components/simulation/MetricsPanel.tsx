import { useState, useEffect } from "react";
import { SimulationState } from "@/pages/Simulation";
import { Gauge, Clock, AlertTriangle, TrendingUp, Activity } from "lucide-react";

interface MetricsPanelProps {
  simulationState: SimulationState;
}

const MetricsPanel = ({ simulationState }: MetricsPanelProps) => {
  const [metrics, setMetrics] = useState({
    avgSpeed: 28,
    congestionLevel: 35,
    bottlenecks: 2,
    travelTime: 12.5,
    throughput: 850,
  });

  // Simulate changing metrics when running
  useEffect(() => {
    if (simulationState !== "running") return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        avgSpeed: Math.max(15, Math.min(45, prev.avgSpeed + (Math.random() - 0.5) * 4)),
        congestionLevel: Math.max(20, Math.min(80, prev.congestionLevel + (Math.random() - 0.5) * 6)),
        bottlenecks: Math.floor(Math.random() * 4) + 1,
        travelTime: Math.max(8, Math.min(20, prev.travelTime + (Math.random() - 0.5) * 2)),
        throughput: Math.max(600, Math.min(1200, prev.throughput + (Math.random() - 0.5) * 100)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationState]);

  const getCongestionColor = (level: number) => {
    if (level > 60) return "text-destructive";
    if (level > 40) return "text-warning";
    return "text-success";
  };

  const getCongestionBg = (level: number) => {
    if (level > 60) return "bg-destructive/10";
    if (level > 40) return "bg-warning/10";
    return "bg-success/10";
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Real-time Metrics</h3>
        </div>
        {simulationState === "running" && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-success/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Average Speed */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Speed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{Math.round(metrics.avgSpeed)}</p>
          <p className="text-[10px] text-muted-foreground">km/h</p>
        </div>

        {/* Congestion Level */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Congestion</span>
          </div>
          <div className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 ${getCongestionBg(metrics.congestionLevel)}`}>
            <p className={`text-2xl font-bold ${getCongestionColor(metrics.congestionLevel)}`}>
              {Math.round(metrics.congestionLevel)}%
            </p>
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Bottlenecks</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.bottlenecks}</p>
          <p className="text-[10px] text-muted-foreground">zones</p>
        </div>

        {/* Travel Time */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Travel</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.travelTime.toFixed(1)}</p>
          <p className="text-[10px] text-muted-foreground">minutes</p>
        </div>

        {/* Throughput */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Throughput</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{Math.round(metrics.throughput)}</p>
          <p className="text-[10px] text-muted-foreground">veh/hr</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
