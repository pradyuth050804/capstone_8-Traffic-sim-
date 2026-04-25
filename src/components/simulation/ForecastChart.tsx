import { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { predictTraffic, buildPredictionPayload } from "@/lib/trafficApi";

interface ForecastChartProps {
  roadId: string;
  distance: number;
  duration: number;
  apiConnected: boolean;
}

interface ForecastPoint {
  hour: string;
  congestion: number;
  rawHour: number;
}

const ForecastChart = ({ roadId, distance, duration, apiConnected }: ForecastChartProps) => {
  const [data, setData] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiConnected || !distance || !duration) return;

    let cancelled = false;
    const fetchForecast = async () => {
      setLoading(true);
      const now = new Date().getHours();
      const points: ForecastPoint[] = [];

      for (let offset = 0; offset <= 6; offset++) {
        const targetHour = (now + offset) % 24;
        const payload = buildPredictionPayload(roadId, distance, duration, targetHour);
        const result = await predictTraffic(payload);

        if (cancelled) return;

        points.push({
          hour: `${targetHour.toString().padStart(2, "0")}:00`,
          congestion: Math.round((result?.predicted_congestion ?? 0) * 100),
          rawHour: targetHour,
        });
      }

      if (!cancelled) {
        setData(points);
        setLoading(false);
      }
    };

    fetchForecast();
    return () => { cancelled = true; };
  }, [roadId, distance, duration, apiConnected]);

  const getGradientColor = (value: number) => {
    if (value > 70) return "#ef4444";
    if (value > 40) return "#eab308";
    return "#22c55e";
  };

  const currentHour = new Date().getHours();

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">6-Hour Forecast</h3>
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
      </div>

      {data.length === 0 && !loading ? (
        <p className="text-xs text-muted-foreground">No forecast data available.</p>
      ) : loading && data.length === 0 ? (
        <div className="h-[140px] flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="h-[140px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="congestionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                formatter={(value: number) => [`${value}%`, "Congestion"]}
                labelFormatter={(label: string) => `Time: ${label}`}
              />
              <ReferenceLine
                x={`${currentHour.toString().padStart(2, "0")}:00`}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="congestion"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const color = getGradientColor(payload.congestion);
                  return (
                    <circle
                      key={payload.hour}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.length > 0 && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[10px] text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-muted-foreground">Severe</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastChart;
