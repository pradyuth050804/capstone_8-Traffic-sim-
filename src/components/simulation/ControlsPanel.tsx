import { SimulationConfig } from "@/pages/Simulation";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Settings2, Car, Bike, Bus, Truck } from "lucide-react";

interface ControlsPanelProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

const ControlsPanel = ({ config, setConfig }: ControlsPanelProps) => {
  const updateMixedTraffic = (key: keyof SimulationConfig["mixedTrafficRatio"], value: number) => {
    setConfig(prev => ({
      ...prev,
      mixedTrafficRatio: {
        ...prev.mixedTrafficRatio,
        [key]: value,
      },
    }));
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Settings2 className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">Simulation Controls</h2>
      </div>

      {/* Lane Discipline */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Lane Discipline</Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[200px]">
              <p className="text-xs">Controls how strictly vehicles follow lane markings. Low = typical Indian traffic behavior.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={config.laneDiscipline}
          onValueChange={(value) => setConfig(prev => ({ ...prev, laneDiscipline: value as SimulationConfig["laneDiscipline"] }))}
          className="flex gap-2"
        >
          {["low", "medium", "high"].map((level) => (
            <div key={level} className="flex items-center">
              <RadioGroupItem value={level} id={`lane-${level}`} className="peer sr-only" />
              <Label
                htmlFor={`lane-${level}`}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-border cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary transition-colors capitalize"
              >
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Road Quality */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Road Surface Quality</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">Affects vehicle speeds. Lower quality = more potholes and uneven surfaces.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-xs text-muted-foreground">{config.roadQuality}%</span>
        </div>
        <Slider
          value={[config.roadQuality]}
          onValueChange={([value]) => setConfig(prev => ({ ...prev, roadQuality: value }))}
          max={100}
          min={20}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Traffic Density */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Traffic Density</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">Number of vehicles in the simulation. Higher = more congestion.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-xs text-muted-foreground">{config.trafficDensity}%</span>
        </div>
        <Slider
          value={[config.trafficDensity]}
          onValueChange={([value]) => setConfig(prev => ({ ...prev, trafficDensity: value }))}
          max={100}
          min={10}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Light</span>
          <span>Heavy</span>
        </div>
      </div>

      {/* Mixed Traffic Ratio */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Vehicle Mix</Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[200px]">
              <p className="text-xs">Distribution of different vehicle types. Reflects typical Indian traffic composition.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-3">
          {/* Two-wheelers */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-muted-foreground">Two-wheelers</span>
              </div>
              <span className="text-xs font-medium">{config.mixedTrafficRatio.twoWheelers}%</span>
            </div>
            <Slider
              value={[config.mixedTrafficRatio.twoWheelers]}
              onValueChange={([value]) => updateMixedTraffic("twoWheelers", value)}
              max={80}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Cars */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Cars</span>
              </div>
              <span className="text-xs font-medium">{config.mixedTrafficRatio.cars}%</span>
            </div>
            <Slider
              value={[config.mixedTrafficRatio.cars]}
              onValueChange={([value]) => updateMixedTraffic("cars", value)}
              max={80}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Auto-rickshaws */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs text-muted-foreground">Auto-rickshaws</span>
              </div>
              <span className="text-xs font-medium">{config.mixedTrafficRatio.autoRickshaws}%</span>
            </div>
            <Slider
              value={[config.mixedTrafficRatio.autoRickshaws]}
              onValueChange={([value]) => updateMixedTraffic("autoRickshaws", value)}
              max={50}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Buses */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bus className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs text-muted-foreground">Buses</span>
              </div>
              <span className="text-xs font-medium">{config.mixedTrafficRatio.buses}%</span>
            </div>
            <Slider
              value={[config.mixedTrafficRatio.buses]}
              onValueChange={([value]) => updateMixedTraffic("buses", value)}
              max={30}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Obstacles Toggle */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Temporary Obstacles</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">Simulates road construction, barricades, and narrow passages.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={config.obstacles}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, obstacles: checked }))}
          />
        </div>
        {config.obstacles && (
          <p className="text-xs text-muted-foreground bg-warning/10 text-warning px-2 py-1.5 rounded">
            2 obstacles active on the road network
          </p>
        )}
      </div>
    </div>
  );
};

export default ControlsPanel;
