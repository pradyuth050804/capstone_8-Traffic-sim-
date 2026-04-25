import { Database, Clock, Calendar, MapPin, Timer, Car } from "lucide-react";
import { TrafficPredictionInput } from "@/lib/trafficApi";

interface ModelInputsCardProps {
  payload: TrafficPredictionInput | null;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ModelInputsCard = ({ payload }: ModelInputsCardProps) => {
  if (!payload) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Model Inputs</h3>
        </div>
        <p className="text-xs text-muted-foreground">Waiting for route data...</p>
      </div>
    );
  }

  const items = [
    { icon: Clock, label: "Hour", value: `${payload.hour}:00`, color: "text-blue-400" },
    { icon: Calendar, label: "Day", value: DAYS[payload.day_of_week] || "—", color: "text-violet-400" },
    { icon: Calendar, label: "Weekend", value: payload.is_weekend ? "Yes" : "No", color: "text-amber-400" },
    { icon: MapPin, label: "Distance", value: `${(payload.distance / 1000).toFixed(1)} km`, color: "text-emerald-400" },
    { icon: Timer, label: "Base Duration", value: `${(payload.duration / 60).toFixed(1)} min`, color: "text-cyan-400" },
    { icon: Car, label: "Est. Traffic Duration", value: `${(payload.duration_in_traffic / 60).toFixed(1)} min`, color: "text-rose-400" },
  ];

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Database className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Model Inputs</h3>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">XGBoost</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <item.icon className={`w-3.5 h-3.5 ${item.color} transition-transform group-hover:scale-110`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <span className="text-xs font-medium text-foreground tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelInputsCard;
