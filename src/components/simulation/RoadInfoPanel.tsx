import { MapPin, Route as RouteIcon, Layers, GitBranch } from "lucide-react";

const RoadInfoPanel = () => {
  const roadStats = {
    totalLength: "4.2 km",
    intersections: 5,
    roadTypes: 3,
    lanes: "2-4",
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-panel p-4 w-56">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <MapPin className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm text-foreground">Road Network</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RouteIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Length</span>
          </div>
          <span className="text-xs font-medium text-foreground">{roadStats.totalLength}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Intersections</span>
          </div>
          <span className="text-xs font-medium text-foreground">{roadStats.intersections}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Road Types</span>
          </div>
          <span className="text-xs font-medium text-foreground">{roadStats.roadTypes}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] text-muted-foreground font-bold">#</span>
            <span className="text-xs text-muted-foreground">Lanes</span>
          </div>
          <span className="text-xs font-medium text-foreground">{roadStats.lanes}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Data source: Google Maps API
        </p>
      </div>
    </div>
  );
};

export default RoadInfoPanel;
