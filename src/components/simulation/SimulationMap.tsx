import { useState, useEffect, useMemo } from "react";
import { SimulationState, SimulationConfig } from "@/pages/Simulation";

interface SimulationMapProps {
  simulationState: SimulationState;
  config: SimulationConfig;
}

interface Vehicle {
  id: number;
  type: "twoWheeler" | "car" | "autoRickshaw" | "bus";
  pathIndex: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

const SimulationMap = ({ simulationState, config }: SimulationMapProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [time, setTime] = useState(0);

  // Road network paths
  const roads = useMemo(() => [
    { id: 1, d: "M 50 200 Q 200 180 400 200 Q 600 220 800 200", name: "MG Road" },
    { id: 2, d: "M 150 50 Q 150 150 200 250 Q 250 350 200 450", name: "Brigade Road" },
    { id: 3, d: "M 50 350 Q 250 330 450 350 Q 650 370 850 350", name: "Residency Road" },
    { id: 4, d: "M 400 50 L 400 450", name: "Richmond Road" },
    { id: 5, d: "M 600 80 Q 580 200 620 320 Q 660 440 600 500", name: "St Marks Road" },
    { id: 6, d: "M 50 120 Q 300 100 550 120 Q 800 140 900 120", name: "Cunningham Road" },
  ], []);

  const intersections = useMemo(() => [
    { x: 200, y: 200, name: "MG-Brigade Junction" },
    { x: 400, y: 200, name: "MG-Richmond Junction" },
    { x: 400, y: 350, name: "Residency-Richmond Junction" },
    { x: 600, y: 200, name: "MG-StMarks Junction" },
    { x: 200, y: 350, name: "Residency-Brigade Junction" },
  ], []);

  // Initialize vehicles based on config
  useEffect(() => {
    const vehicleTypes = [
      { type: "twoWheeler" as const, ratio: config.mixedTrafficRatio.twoWheelers, color: "#10b981", size: 4 },
      { type: "car" as const, ratio: config.mixedTrafficRatio.cars, color: "#3b82f6", size: 6 },
      { type: "autoRickshaw" as const, ratio: config.mixedTrafficRatio.autoRickshaws, color: "#f59e0b", size: 5 },
      { type: "bus" as const, ratio: config.mixedTrafficRatio.buses, color: "#ef4444", size: 8 },
    ];

    const totalVehicles = Math.floor(config.trafficDensity / 5);
    const newVehicles: Vehicle[] = [];
    let id = 0;

    vehicleTypes.forEach(({ type, ratio, color, size }) => {
      const count = Math.floor((ratio / 100) * totalVehicles);
      for (let i = 0; i < count; i++) {
        newVehicles.push({
          id: id++,
          type,
          pathIndex: Math.floor(Math.random() * roads.length),
          progress: Math.random() * 100,
          speed: (0.2 + Math.random() * 0.3) * (config.roadQuality / 100),
          color,
          size,
        });
      }
    });

    setVehicles(newVehicles);
  }, [config, roads.length]);

  // Animation loop
  useEffect(() => {
    if (simulationState !== "running") return;

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setVehicles(prev => prev.map(v => ({
        ...v,
        progress: (v.progress + v.speed) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [simulationState]);

  const getTrafficColor = () => {
    if (config.trafficDensity > 70) return "hsl(0 72% 51%)";
    if (config.trafficDensity > 40) return "hsl(38 92% 50%)";
    return "hsl(142 71% 45%)";
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-muted to-secondary/30 relative overflow-hidden">
      {/* Map Background Pattern */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
          </pattern>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(215 25% 40%)" />
            <stop offset="50%" stopColor="hsl(215 25% 50%)" />
            <stop offset="100%" stopColor="hsl(215 25% 40%)" />
          </linearGradient>
          <filter id="roadShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
          <filter id="vehicleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#mapGrid)" />

        {/* Land blocks */}
        <rect x="80" y="80" width="100" height="80" rx="4" fill="hsl(120 25% 92%)" opacity="0.5" />
        <rect x="220" y="80" width="150" height="90" rx="4" fill="hsl(120 25% 90%)" opacity="0.5" />
        <rect x="450" y="250" width="120" height="70" rx="4" fill="hsl(120 25% 92%)" opacity="0.5" />
        <rect x="700" y="100" width="140" height="100" rx="4" fill="hsl(120 25% 90%)" opacity="0.5" />
        <rect x="100" y="380" width="180" height="60" rx="4" fill="hsl(120 25% 92%)" opacity="0.5" />
        <rect x="500" y="380" width="200" height="80" rx="4" fill="hsl(120 25% 91%)" opacity="0.5" />
      </svg>

      {/* Road Network SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
        {/* Roads */}
        {roads.map((road) => (
          <g key={road.id}>
            {/* Road base with shadow */}
            <path
              d={road.d}
              fill="none"
              stroke="url(#roadGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              filter="url(#roadShadow)"
            />
            {/* Road surface */}
            <path
              d={road.d}
              fill="none"
              stroke="hsl(215 20% 55%)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Center line */}
            <path
              d={road.d}
              fill="none"
              stroke="hsl(45 100% 60%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="12 8"
              opacity="0.8"
            />
          </g>
        ))}

        {/* Intersections */}
        {intersections.map((intersection, index) => (
          <g key={index}>
            <circle
              cx={intersection.x}
              cy={intersection.y}
              r="18"
              fill="hsl(215 20% 50%)"
            />
            <circle
              cx={intersection.x}
              cy={intersection.y}
              r="8"
              fill={getTrafficColor()}
              className={simulationState === "running" ? "animate-pulse-soft" : ""}
            />
          </g>
        ))}

        {/* Animated Vehicles */}
        {simulationState !== "idle" && vehicles.map((vehicle) => (
          <circle
            key={vehicle.id}
            r={vehicle.size}
            fill={vehicle.color}
            filter="url(#vehicleGlow)"
            opacity={simulationState === "paused" ? 0.6 : 1}
          >
            <animateMotion
              dur={`${8 - vehicle.speed * 10}s`}
              repeatCount="indefinite"
              path={roads[vehicle.pathIndex].d}
              begin={`${vehicle.progress / 10}s`}
            />
          </circle>
        ))}

        {/* Obstacles */}
        {config.obstacles && (
          <>
            <rect x="300" y="190" width="30" height="20" rx="3" fill="hsl(0 72% 51%)" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1s" repeatCount="indefinite" />
            </rect>
            <rect x="550" y="340" width="25" height="18" rx="3" fill="hsl(38 92% 50%)" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </>
        )}
      </svg>

      {/* Map Labels Overlay */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border p-3 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-foreground">
            {simulationState === "running" ? "LIVE" : simulationState === "paused" ? "PAUSED" : "READY"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Central Bangalore</p>
        <p className="text-[10px] text-muted-foreground mt-1">12.9716° N, 77.5946° E</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-20 right-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border p-3 shadow-soft">
        <p className="text-xs font-medium text-foreground mb-2">Vehicle Types</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-[10px] text-muted-foreground">Two-wheelers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 rounded-sm bg-blue-500" />
            <span className="text-[10px] text-muted-foreground">Cars</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2 rounded-sm bg-warning" />
            <span className="text-[10px] text-muted-foreground">Auto-rickshaws</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-sm bg-destructive" />
            <span className="text-[10px] text-muted-foreground">Buses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationMap;
