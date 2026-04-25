import { useState, useEffect, useCallback } from "react";
import { Route, Home, BarChart3, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SimulationMap from "@/components/simulation/SimulationMap";
import MetricsPanel from "@/components/simulation/MetricsPanel";
import ModelInputsCard from "@/components/simulation/ModelInputsCard";
import ContributingFactors from "@/components/simulation/ContributingFactors";
import ForecastChart from "@/components/simulation/ForecastChart";
import FeatureImportance from "@/components/simulation/FeatureImportance";
import ScenarioControls, { ScenarioState } from "@/components/simulation/ScenarioControls";
import ScenarioComparison from "@/components/simulation/ScenarioComparison";
import {
  predictTraffic,
  buildPredictionPayload,
  checkApiHealth,
  TrafficPredictionInput,
} from "@/lib/trafficApi";

export type SimulationState = "idle" | "running" | "paused";

export interface SimulationConfig {
  selectedRoute: string;
}

const Simulation = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    selectedRoute: "YLK_KIA_01",
  });

  const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Normal prediction (current real-time conditions)
  const [normalCongestion, setNormalCongestion] = useState<number | null>(null);

  // Scenario state
  const [scenario, setScenario] = useState<ScenarioState>({
    hour: new Date().getHours(),
    weatherFactor: 1,
    eventFactor: 1,
  });

  // Scenario prediction (ML base * weather * event factors)
  const [scenarioCongestion, setScenarioCongestion] = useState<number | null>(null);
  const [scenarioPayload, setScenarioPayload] = useState<TrafficPredictionInput | null>(null);

  // API health check
  useEffect(() => {
    checkApiHealth().then(setApiConnected);
  }, []);

  // Fetch NORMAL prediction (real current hour, no scenario factors)
  useEffect(() => {
    if (!apiConnected || !routeStats) return;

    let cancelled = false;
    const fetch = async () => {
      const payload = buildPredictionPayload(config.selectedRoute, routeStats.distance, routeStats.duration);
      const result = await predictTraffic(payload);
      if (!cancelled) {
        setNormalCongestion(result?.predicted_congestion ?? null);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [config.selectedRoute, routeStats, apiConnected]);

  // Fetch SCENARIO prediction (user-selected hour + weather/event multipliers)
  useEffect(() => {
    if (!apiConnected || !routeStats) return;

    let cancelled = false;
    const fetchScenario = async () => {
      setIsLoading(true);
      const payload = buildPredictionPayload(
        config.selectedRoute,
        routeStats.distance,
        routeStats.duration,
        scenario.hour
      );
      setScenarioPayload(payload);

      const result = await predictTraffic(payload);
      if (!cancelled) {
        const basePrediction = result?.predicted_congestion ?? 0;
        // Apply weather and event multipliers, cap at 1.0
        const adjusted = Math.min(basePrediction * scenario.weatherFactor * scenario.eventFactor, 1.0);
        setScenarioCongestion(adjusted);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchScenario, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config.selectedRoute, routeStats, apiConnected, scenario]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">RoadSim AI</span>
          </Link>
          <div className="h-6 w-px bg-border" />

          {/* FROM / TO Selectors */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">FROM:</span>
              <Select disabled value="yelahanka">
                <SelectTrigger className="w-[130px] h-8 text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yelahanka">Yelahanka</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">TO:</span>
              <Select
                value={config.selectedRoute}
                onValueChange={(val) => setConfig({ selectedRoute: val })}
              >
                <SelectTrigger className="w-[230px] h-8 text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YLK_KIA_01">Kempegowda Int'l Airport</SelectItem>
                  <SelectItem value="YLK_PU_01">Presidency University</SelectItem>
                  <SelectItem value="YLK_JK_01">Jakkur</SelectItem>
                  <SelectItem value="YLK_BG_01">Bagalur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/analytics">
            <Button size="sm" variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
          </Link>
          <Link to="/">
            <Button size="sm" variant="ghost">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Layout: Scenario Controls | Map | AI Insights */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Scenario Controls */}
        <aside className="w-[300px] shrink-0 border-r border-border bg-background/50 overflow-y-auto">
          <div className="p-4 space-y-4">
            <ScenarioControls scenario={scenario} onChange={setScenario} />
            <ScenarioComparison
              normalCongestion={normalCongestion}
              scenarioCongestion={scenarioCongestion}
              baseDuration={routeStats?.duration || 0}
              weatherFactor={scenario.weatherFactor}
              eventFactor={scenario.eventFactor}
            />
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center transition-opacity duration-300">
              <Loader2 className="w-7 h-7 animate-spin text-primary mb-2" />
              <span className="text-xs font-medium text-muted-foreground">AI is analyzing scenario...</span>
            </div>
          )}

          <SimulationMap
            simulationState="running"
            config={config}
            predictedCongestion={scenarioCongestion}
            onRouteStats={(stats) => setRouteStats(stats)}
          />

          {/* Floating time indicator */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm px-4 py-2.5 flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Predicted traffic at</span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {(() => {
                    const h = scenario.hour;
                    const period = h >= 12 ? "PM" : "AM";
                    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return `${display}:00 ${period}`;
                  })()}
                </span>
              </div>
              {scenarioCongestion !== null && (
                <div className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                  scenarioCongestion > 0.7 ? "bg-red-500/15 text-red-400" :
                  scenarioCongestion > 0.4 ? "bg-amber-500/15 text-amber-400" :
                  "bg-emerald-500/15 text-emerald-400"
                }`}>
                  {Math.round(scenarioCongestion * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Floating Metrics */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <MetricsPanel
              simulationState="running"
              config={config}
              predictedCongestion={scenarioCongestion}
              apiConnected={apiConnected}
              routeStats={routeStats}
            />
          </div>
        </main>

        {/* Right Sidebar: AI Insights */}
        <aside className="w-[340px] shrink-0 border-l border-border bg-background/50 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Brain className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">AI Insights</h2>
              <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                {apiConnected ? "Connected" : "Offline"}
              </span>
            </div>

            <ModelInputsCard payload={scenarioPayload} />

            <ContributingFactors
              payload={scenarioPayload}
              predictedCongestion={scenarioCongestion}
              weatherFactor={scenario.weatherFactor}
              eventFactor={scenario.eventFactor}
            />

            <ForecastChart
              roadId={config.selectedRoute}
              distance={routeStats?.distance || 0}
              duration={routeStats?.duration || 0}
              apiConnected={apiConnected}
            />

            <FeatureImportance />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Simulation;
