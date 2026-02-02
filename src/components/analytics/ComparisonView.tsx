import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const comparisonData = [
  { metric: "Avg Speed (km/h)", before: 22.5, after: 28.4 },
  { metric: "Travel Time (min)", before: 18.2, after: 14.2 },
  { metric: "Congestion (%)", before: 68, after: 52 },
  { metric: "Throughput (×100)", before: 7.5, after: 8.9 },
];

const scenarios = [
  { id: "baseline", name: "Baseline", description: "Current road conditions" },
  { id: "improved", name: "Improved Roads", description: "Better surface quality" },
  { id: "signals", name: "Optimized Signals", description: "Smart traffic signals" },
  { id: "mixed", name: "Reduced Mix", description: "Lower two-wheeler ratio" },
];

const ComparisonView = () => {
  const [scenarioA, setScenarioA] = useState("baseline");
  const [scenarioB, setScenarioB] = useState("improved");

  const improvements = [
    { label: "Average speed increased", value: "+26%" },
    { label: "Travel time reduced", value: "-22%" },
    { label: "Congestion decreased", value: "-24%" },
    { label: "Throughput improved", value: "+19%" },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Compare Scenarios</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Scenario A (Before)</p>
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setScenarioA(scenario.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    scenarioA === scenario.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Scenario B (After)</p>
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setScenarioB(scenario.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    scenarioB === scenario.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Performance Comparison</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
              <XAxis 
                dataKey="metric" 
                tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
                axisLine={{ stroke: "hsl(214 20% 88%)" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "hsl(215 15% 45%)" }}
                axisLine={{ stroke: "hsl(214 20% 88%)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(214 20% 88%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar 
                dataKey="before" 
                name="Before" 
                fill="hsl(213 50% 20%)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="after" 
                name="After" 
                fill="hsl(172 66% 40%)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Improvements */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Key Improvements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {improvements.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-success">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Summary:</strong> The improved scenario shows significant 
            reductions in congestion and travel time, with higher throughput capacity. These improvements 
            are achieved through better road surface quality and optimized traffic signal timing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
