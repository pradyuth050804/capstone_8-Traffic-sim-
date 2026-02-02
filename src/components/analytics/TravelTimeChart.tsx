import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TravelTimeChartProps {
  fullSize?: boolean;
}

const data = [
  { hour: "6AM", time: 8.2 },
  { hour: "7AM", time: 10.5 },
  { hour: "8AM", time: 15.8 },
  { hour: "9AM", time: 18.2 },
  { hour: "10AM", time: 14.1 },
  { hour: "11AM", time: 11.5 },
  { hour: "12PM", time: 12.3 },
  { hour: "1PM", time: 13.8 },
  { hour: "2PM", time: 12.1 },
  { hour: "3PM", time: 11.8 },
  { hour: "4PM", time: 13.5 },
  { hour: "5PM", time: 16.9 },
  { hour: "6PM", time: 19.2 },
  { hour: "7PM", time: 17.4 },
  { hour: "8PM", time: 12.8 },
  { hour: "9PM", time: 9.5 },
];

const TravelTimeChart = ({ fullSize = false }: TravelTimeChartProps) => {
  return (
    <div className={fullSize ? "h-[400px]" : "h-[250px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="travelTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(172 66% 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(172 66% 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
            axisLine={{ stroke: "hsl(214 20% 88%)" }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
            axisLine={{ stroke: "hsl(214 20% 88%)" }}
            tickLine={false}
            label={{ 
              value: "Minutes", 
              angle: -90, 
              position: "insideLeft",
              style: { fontSize: 11, fill: "hsl(215 15% 45%)" }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(214 20% 88%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value: number) => [`${value.toFixed(1)} min`, "Travel Time"]}
          />
          <Area
            type="monotone"
            dataKey="time"
            stroke="hsl(172 66% 40%)"
            strokeWidth={2}
            fill="url(#travelTimeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TravelTimeChart;
