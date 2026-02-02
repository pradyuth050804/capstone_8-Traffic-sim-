import { MapPin, Cpu, BarChart3, ChevronRight } from "lucide-react";

const ProcessFlow = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Data Extraction",
      description: "Google Maps API",
      color: "bg-primary"
    },
    {
      icon: Cpu,
      title: "Road Modeling",
      description: "Network Generation",
      color: "bg-accent"
    },
    {
      icon: BarChart3,
      title: "Simulation",
      description: "Traffic Analysis",
      color: "bg-success"
    }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-xl ${step.color} flex items-center justify-center mb-3 shadow-soft`}>
              <step.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="hidden md:flex items-center px-8">
              <div className="w-16 h-0.5 bg-border relative">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-accent/50 to-transparent" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground -ml-1" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProcessFlow;
