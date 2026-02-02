interface TrafficHeatmapProps {
  fullSize?: boolean;
}

const TrafficHeatmap = ({ fullSize = false }: TrafficHeatmapProps) => {
  // Generate heatmap data
  const hours = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`);
  const segments = ["MG Road", "Brigade Rd", "Residency Rd", "Richmond Rd", "St Marks Rd", "Cunningham Rd"];
  
  // Traffic intensity data (0-100)
  const intensityData = [
    [20, 35, 65, 85, 70, 45, 40, 55, 50, 45, 55, 75, 90, 80, 55, 30], // MG Road
    [15, 30, 55, 70, 55, 40, 35, 45, 40, 35, 45, 65, 75, 70, 45, 25], // Brigade Rd
    [25, 40, 70, 80, 65, 50, 45, 55, 50, 50, 60, 80, 85, 75, 50, 35], // Residency Rd
    [10, 20, 40, 50, 40, 30, 25, 35, 30, 25, 35, 50, 55, 50, 35, 20], // Richmond Rd
    [18, 32, 55, 65, 50, 38, 32, 42, 38, 35, 45, 60, 70, 65, 42, 28], // St Marks Rd
    [12, 22, 38, 45, 35, 28, 22, 30, 26, 22, 30, 42, 48, 44, 30, 18], // Cunningham Rd
  ];

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
        {segments.map((segment, rowIndex) => (
          <div key={segment} className="flex items-center mb-1">
            <div className="w-24 flex-shrink-0 text-xs text-muted-foreground truncate pr-2">
              {segment}
            </div>
            <div className="flex-1 flex gap-0.5">
              {intensityData[rowIndex].map((intensity, colIndex) => (
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
        ))}

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
