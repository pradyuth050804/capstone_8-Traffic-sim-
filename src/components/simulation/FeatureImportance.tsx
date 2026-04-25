import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FEATURE_IMPORTANCE = [
  { feature: "duration_in_traffic", importance: 0.42, label: "Traffic Duration" },
  { feature: "duration", importance: 0.22, label: "Base Duration" },
  { feature: "hour", importance: 0.15, label: "Hour of Day" },
  { feature: "road_id", importance: 0.09, label: "Route ID" },
  { feature: "distance", importance: 0.06, label: "Distance" },
  { feature: "day_of_week", importance: 0.04, label: "Day of Week" },
  { feature: "is_weekend", importance: 0.02, label: "Is Weekend" },
];

const COLORS = [
  "hsl(262, 83%, 58%)", // violet
  "hsl(220, 83%, 58%)", // blue
  "hsl(190, 83%, 48%)", // cyan
  "hsl(150, 60%, 48%)", // green
  "hsl(38, 92%, 50%)",  // amber
  "hsl(10, 78%, 54%)",  // orange
  "hsl(340, 65%, 48%)", // pink
];

const FeatureImportance = () => {
  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <BarChart3 className="w-4 h-4 text-violet-400" />
        <h3 className="font-semibold text-sm text-foreground">What influences traffic?</h3>
      </div>

      <div className="h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={FEATURE_IMPORTANCE}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 0.5]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={14}>
              {FEATURE_IMPORTANCE.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
        Based on XGBoost model feature importance scores
      </p>
    </div>
  );
};

export default FeatureImportance;
