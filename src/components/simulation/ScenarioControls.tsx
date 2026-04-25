import { Clock, CloudRain, Users, Sun, CloudDrizzle, CloudLightning, Minus, AlertTriangle, Flame } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ScenarioState {
  hour: number;
  weatherFactor: number;
  eventFactor: number;
}

interface ScenarioControlsProps {
  scenario: ScenarioState;
  onChange: (scenario: ScenarioState) => void;
}

const ScenarioControls = ({ scenario, onChange }: ScenarioControlsProps) => {
  const formatHour = (h: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${display}:00 ${period}`;
  };

  const getTimeEmoji = (h: number) => {
    if (h >= 6 && h < 12) return "🌅";
    if (h >= 12 && h < 17) return "☀️";
    if (h >= 17 && h < 20) return "🌆";
    return "🌙";
  };

  const isPeakHour = (h: number) => (h >= 8 && h <= 10) || (h >= 17 && h <= 20);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <span className="text-xs">🔮</span>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">What-If Scenarios</h3>
          <p className="text-[10px] text-muted-foreground">Simulate conditions Google Maps can't</p>
        </div>
      </div>

      {/* Time of Day */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-foreground">Time of Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{getTimeEmoji(scenario.hour)}</span>
            <span className="text-xs font-semibold text-foreground tabular-nums">{formatHour(scenario.hour)}</span>
            {isPeakHour(scenario.hour) && (
              <span className="text-[9px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">PEAK</span>
            )}
          </div>
        </div>
        <Slider
          value={[scenario.hour]}
          onValueChange={([h]) => onChange({ ...scenario, hour: h })}
          min={0}
          max={23}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>

        {/* Quick preset buttons */}
        <div className="flex gap-1.5 pt-1">
          {[
            { label: "🌅 Morning Peak", hour: 9 },
            { label: "☀️ Afternoon", hour: 14 },
            { label: "🌆 Evening Peak", hour: 18 },
            { label: "🌙 Night", hour: 22 },
          ].map((preset) => (
            <button
              key={preset.hour}
              onClick={() => onChange({ ...scenario, hour: preset.hour })}
              className={`flex-1 text-[10px] font-medium py-1.5 rounded-md border transition-all duration-200 ${
                scenario.hour === preset.hour
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Factor */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-foreground">Weather Condition</span>
        </div>
        <Select
          value={String(scenario.weatherFactor)}
          onValueChange={(val) => onChange({ ...scenario, weatherFactor: parseFloat(val) })}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Clear Sky</span>
                <span className="text-muted-foreground ml-1">×1.0</span>
              </div>
            </SelectItem>
            <SelectItem value="1.2">
              <div className="flex items-center gap-2">
                <CloudDrizzle className="w-3.5 h-3.5 text-blue-400" />
                <span>Light Rain</span>
                <span className="text-muted-foreground ml-1">×1.2</span>
              </div>
            </SelectItem>
            <SelectItem value="1.5">
              <div className="flex items-center gap-2">
                <CloudLightning className="w-3.5 h-3.5 text-violet-400" />
                <span>Heavy Rain</span>
                <span className="text-muted-foreground ml-1">×1.5</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Factor */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs font-medium text-foreground">Nearby Events</span>
        </div>
        <Select
          value={String(scenario.eventFactor)}
          onValueChange={(val) => onChange({ ...scenario, eventFactor: parseFloat(val) })}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                <span>No Events</span>
                <span className="text-muted-foreground ml-1">×1.0</span>
              </div>
            </SelectItem>
            <SelectItem value="1.3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Moderate Event</span>
                <span className="text-muted-foreground ml-1">×1.3</span>
              </div>
            </SelectItem>
            <SelectItem value="1.6">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Major Event</span>
                <span className="text-muted-foreground ml-1">×1.6</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ScenarioControls;
