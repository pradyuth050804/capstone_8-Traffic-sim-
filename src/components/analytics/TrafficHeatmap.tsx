interface TrafficHeatmapProps {
  fullSize?: boolean;
  segments: string[];
  intensityData: number[][];
}

const TrafficHeatmap = ({ fullSize = false, segments, intensityData }: TrafficHeatmapProps) => {
  // Generate heatmap data
  const hours = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`);

  // Guard: don't render if data hasn't arrived yet
  if (!intensityData || intensityData.length === 0 || !segments || segments.length === 0) {
    return (
      <div className={`flex items-center justify-center text-sm text-muted-foreground ${fullSize ? "h-[200px]" : "h-[150px]"}`}>
        No heatmap data available yet.
      </div>
    );
  }

  const getColor = (intensity: number) => {
    if (intensity > 75) return "bg-destructive";
    if (intensity > 50) return "bg-warning";
    if (intensity > 25) return "bg-success/80";
    return "bg-success/40";
  };

  const getOpacity = (intensity: number) => {
    return 0.3 + (intensity / 100) * 0.7;
  };

  return (
    <div className={`overflow-x-auto ${fullSize ? "" : "max-h-[250px]"}`}>
      <div className="min-w-[600px]">
        {/* Header row */}
        <div className="flex mb-2">
          <div className="w-24 flex-shrink-0" />
          <div className="flex-1 flex">
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="flex-1 text-[10px] text-muted-foreground text-center"
                style={{ minWidth: fullSize ? 40 : 30 }}
              >
                {i % 2 === 0 ? hour.replace(":00", "") : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Data rows */}
        {segments.map((segment, rowIndex) => {
          const rowData = intensityData[rowIndex];
          if (!rowData) return null;
          return (
          <div key={segment} className="flex items-center mb-1">
            <div className="w-24 flex-shrink-0 text-xs text-muted-foreground truncate pr-2">
              {segment}
            </div>
            <div className="flex-1 flex gap-0.5">
              {rowData.map((intensity, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex-1 rounded-sm ${getColor(intensity)} transition-all hover:scale-110 cursor-pointer`}
                  style={{ 
                    height: fullSize ? 28 : 20,
                    minWidth: fullSize ? 38 : 28,
                    opacity: getOpacity(intensity),
                  }}
                  title={`${segment} at ${hours[colIndex]}: ${intensity}% congestion`}
                />
              ))}
            </div>
          </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Congestion Level:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-success/40" />
            <span className="text-[10px] text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-success/80" />
            <span className="text-[10px] text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-warning" />
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-destructive" />
            <span className="text-[10px] text-muted-foreground">Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficHeatmap;
