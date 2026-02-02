import { useEffect, useState } from "react";

const HeroVisualization = () => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Road network paths
  const roads = [
    { id: 1, d: "M 50 150 Q 150 100 250 150 T 450 150", delay: 0 },
    { id: 2, d: "M 100 50 Q 150 150 100 250 T 150 450", delay: 0.5 },
    { id: 3, d: "M 50 250 Q 200 200 350 250 T 450 280", delay: 1 },
    { id: 4, d: "M 250 50 L 250 350", delay: 0.3 },
    { id: 5, d: "M 350 80 Q 300 200 350 320", delay: 0.7 },
  ];

  // Intersection points
  const intersections = [
    { cx: 150, cy: 150 },
    { cx: 250, cy: 150 },
    { cx: 250, cy: 250 },
    { cx: 350, cy: 250 },
    { cx: 150, cy: 250 },
  ];

  // Vehicles (animated dots)
  const vehicles = [
    { id: 1, path: roads[0].d, color: "#10b981", duration: 4 },
    { id: 2, path: roads[1].d, color: "#f59e0b", duration: 5 },
    { id: 3, path: roads[2].d, color: "#10b981", duration: 4.5 },
    { id: 4, path: roads[0].d, color: "#ef4444", duration: 6 },
    { id: 5, path: roads[3].d, color: "#10b981", duration: 3.5 },
  ];

  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 rounded-3xl" />
      
      {/* Map container */}
      <div className="absolute inset-4 bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main SVG */}
        <svg 
          viewBox="0 0 500 400" 
          className="w-full h-full relative z-10"
          key={animationKey}
        >
          <defs>
            {/* Road gradient */}
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(215 25% 35%)" />
              <stop offset="100%" stopColor="hsl(215 25% 45%)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Roads */}
          {roads.map((road) => (
            <g key={road.id}>
              {/* Road shadow */}
              <path
                d={road.d}
                fill="none"
                stroke="hsl(215 25% 25%)"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.1"
              />
              {/* Road base */}
              <path
                d={road.d}
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                className="animate-fade-in"
                style={{ animationDelay: `${road.delay}s` }}
              />
              {/* Road center line */}
              <path
                d={road.d}
                fill="none"
                stroke="hsl(38 92% 50%)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="8 12"
                opacity="0.6"
              />
            </g>
          ))}

          {/* Intersections */}
          {intersections.map((int, index) => (
            <g key={index}>
              <circle
                cx={int.cx}
                cy={int.cy}
                r="12"
                fill="hsl(215 25% 30%)"
                className="animate-scale-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s`, transformOrigin: `${int.cx}px ${int.cy}px` }}
              />
              <circle
                cx={int.cx}
                cy={int.cy}
                r="6"
                fill="hsl(172 66% 40%)"
                filter="url(#glow)"
                className="animate-pulse-soft"
              />
            </g>
          ))}

          {/* Animated vehicles */}
          {vehicles.map((vehicle) => (
            <circle
              key={vehicle.id}
              r="4"
              fill={vehicle.color}
              filter="url(#glow)"
            >
              <animateMotion
                dur={`${vehicle.duration}s`}
                repeatCount="indefinite"
                path={vehicle.path}
              />
            </circle>
          ))}

          {/* Labels */}
          <text x="420" y="30" className="text-xs fill-muted-foreground font-medium">
            LIVE
          </text>
          <circle cx="405" cy="26" r="4" fill="hsl(142 71% 45%)" className="animate-pulse-soft" />
        </svg>

        {/* Overlay info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">Bangalore, India</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Low Traffic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisualization;
