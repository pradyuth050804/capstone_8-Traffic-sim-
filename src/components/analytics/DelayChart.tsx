import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DelayChartProps {
  fullSize?: boolean;
}

const data = [
  { segment: "MG Road", delay: 4.2, congestion: "high" },
  { segment: "Brigade Rd", delay: 2.8, congestion: "medium" },
  { segment: "Residency Rd", delay: 3.5, congestion: "high" },
  { segment: "Richmond Rd", delay: 1.9, congestion: "low" },
  { segment: "St Marks Rd", delay: 2.4, congestion: "medium" },
  { segment: "Cunningham Rd", delay: 1.2, congestion: "low" },
];

const getBarColor = (congestion: string) => {
  switch (congestion) {
    case "high":
      return "hsl(0 72% 51%)";
    case "medium":
      return "hsl(38 92% 50%)";
    default:
      return "hsl(142 71% 45%)";
  }
};

const DelayChart = ({ fullSize = false }: DelayChartProps) => {
  return (
    <div className={fullSize ? "h-[400px]" : "h-[250px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
            axisLine={{ stroke: "hsl(214 20% 88%)" }}
            tickLine={false}
            label={{ 
              value: "Delay (minutes)", 
              position: "bottom",
              style: { fontSize: 11, fill: "hsl(215 15% 45%)" }
            }}
          />
          <YAxis 
            type="category"
            dataKey="segment"
            tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
            axisLine={{ stroke: "hsl(214 20% 88%)" }}
            tickLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(214 20% 88%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value: number, name: string, props: any) => [
              `${value.toFixed(1)} min delay`,
              `Congestion: ${props.payload.congestion}`,
            ]}
          />
          <Bar dataKey="delay" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.congestion)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DelayChart;
