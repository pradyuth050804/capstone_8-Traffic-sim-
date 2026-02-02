import { useState } from "react";
import { Route, Home, Play, Pause, RotateCcw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SimulationMap from "@/components/simulation/SimulationMap";
import ControlsPanel from "@/components/simulation/ControlsPanel";
import MetricsPanel from "@/components/simulation/MetricsPanel";
import RoadInfoPanel from "@/components/simulation/RoadInfoPanel";

export type SimulationState = "idle" | "running" | "paused";

export interface SimulationConfig {
  laneDiscipline: "low" | "medium" | "high";
  roadQuality: number;
  trafficDensity: number;
  mixedTrafficRatio: {
    twoWheelers: number;
    cars: number;
    autoRickshaws: number;
    buses: number;
  };
  obstacles: boolean;
}

const Simulation = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const [config, setConfig] = useState<SimulationConfig>({
    laneDiscipline: "medium",
    roadQuality: 70,
    trafficDensity: 50,
    mixedTrafficRatio: {
      twoWheelers: 40,
      cars: 35,
      autoRickshaws: 15,
      buses: 10,
    },
    obstacles: false,
  });

  const handleStart = () => setSimulationState("running");
  const handlePause = () => setSimulationState("paused");
  const handleReset = () => setSimulationState("idle");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Route className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">RoadSim</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Traffic Simulation</span>
        </div>
        
        <div className="flex items-center gap-2">
          {simulationState === "idle" && (
            <Button onClick={handleStart} size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Start Simulation
            </Button>
          )}
          {simulationState === "running" && (
            <Button onClick={handlePause} size="sm" variant="secondary" className="gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          {simulationState === "paused" && (
            <>
              <Button onClick={handleStart} size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Resume
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </>
          )}
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-80 border-r border-border bg-card overflow-y-auto">
          <ControlsPanel config={config} setConfig={setConfig} />
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <SimulationMap 
            simulationState={simulationState} 
            config={config}
          />
          
          {/* Floating Road Info */}
          <div className="absolute top-4 left-4 z-10">
            <RoadInfoPanel />
          </div>
          
          {/* Floating Metrics */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <MetricsPanel simulationState={simulationState} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Simulation;
