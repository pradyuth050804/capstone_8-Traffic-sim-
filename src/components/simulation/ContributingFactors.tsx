import { Lightbulb, Clock, MapPin, TrendingUp, AlertTriangle, Sun, Moon, CloudRain, Users } from "lucide-react";
import { TrafficPredictionInput } from "@/lib/trafficApi";

interface ContributingFactorsProps {
  payload: TrafficPredictionInput | null;
  predictedCongestion: number | null;
  weatherFactor?: number;
  eventFactor?: number;
}

const ContributingFactors = ({ payload, predictedCongestion, weatherFactor = 1, eventFactor = 1 }: ContributingFactorsProps) => {
  if (!payload || predictedCongestion === null) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm text-foreground">Why is traffic like this?</h3>
        </div>
        <p className="text-xs text-muted-foreground">Waiting for prediction...</p>
      </div>
    );
  }

  const hour = payload.hour;
  const delayRatio = payload.duration_in_traffic / payload.duration;
  const isAirportRoute = payload.road_id.includes("KIA");

  const insights: { icon: React.ElementType; text: string; severity: "info" | "warn" | "danger" }[] = [];

  // Time-of-day
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    insights.push({ icon: AlertTriangle, text: "Peak hour traffic detected", severity: "danger" });
  } else if (hour >= 11 && hour <= 16) {
    insights.push({ icon: Sun, text: "Mid-day — moderate traffic expected", severity: "info" });
  } else if (hour >= 21 || hour <= 5) {
    insights.push({ icon: Moon, text: "Off-peak hours — roads are clear", severity: "info" });
  } else {
    insights.push({ icon: Clock, text: "Transitional period — traffic building", severity: "warn" });
  }

  // Route factor
  if (isAirportRoute) {
    insights.push({ icon: MapPin, text: "Airport corridor — historically congested", severity: "warn" });
  }

  // Delay ratio
  if (delayRatio > 1.4) {
    insights.push({ icon: TrendingUp, text: `High delay ratio (${delayRatio.toFixed(2)}×) → congestion likely`, severity: "danger" });
  } else if (delayRatio > 1.15) {
    insights.push({ icon: TrendingUp, text: `Moderate delay ratio (${delayRatio.toFixed(2)}×)`, severity: "warn" });
  } else {
    insights.push({ icon: TrendingUp, text: `Low delay ratio (${delayRatio.toFixed(2)}×) → smooth flow`, severity: "info" });
  }

  // Weekend
  if (payload.is_weekend) {
    insights.push({ icon: Sun, text: "Weekend — lower commuter volume", severity: "info" });
  }

  // Weather factor
  if (weatherFactor > 1) {
    const weatherLabel = weatherFactor >= 1.5 ? "Heavy rain" : "Light rain";
    const sev = weatherFactor >= 1.5 ? "danger" : "warn";
    insights.push({ icon: CloudRain, text: `${weatherLabel} — increases congestion by ${Math.round((weatherFactor - 1) * 100)}%`, severity: sev as "warn" | "danger" });
  }

  // Event factor
  if (eventFactor > 1) {
    const eventLabel = eventFactor >= 1.6 ? "Major event" : "Moderate event";
    const sev = eventFactor >= 1.6 ? "danger" : "warn";
    insights.push({ icon: Users, text: `${eventLabel} nearby — traffic load +${Math.round((eventFactor - 1) * 100)}%`, severity: sev as "warn" | "danger" });
  }

  // Congestion severity
  if (predictedCongestion > 0.7) {
    insights.push({ icon: AlertTriangle, text: "Severe congestion — consider alternate routes", severity: "danger" });
  }

  const severityStyles = {
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h3 className="font-semibold text-sm text-foreground">Why is traffic like this?</h3>
      </div>

      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${severityStyles[insight.severity]}`}
          >
            <insight.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributingFactors;
