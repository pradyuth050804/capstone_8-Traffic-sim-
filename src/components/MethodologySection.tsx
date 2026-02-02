import { Target, Lightbulb, Database, CheckCircle2 } from "lucide-react";

const MethodologySection = () => {
  const methodologies = [
    {
      icon: Target,
      title: "Problem Statement",
      content: "Traditional traffic simulation tools lack accurate representation of Indian urban road conditions, including mixed traffic, variable lane discipline, and informal road usage patterns."
    },
    {
      icon: Lightbulb,
      title: "Objective",
      content: "Develop an automated system that generates high-fidelity road network models from Google Maps data and simulates realistic Indian traffic scenarios for urban planning applications."
    },
    {
      icon: Database,
      title: "Data Utilization",
      content: "Google Maps API provides road geometry, intersection configurations, speed limits, and road classifications. This data is processed to create topologically accurate network models."
    }
  ];

  const keyFeatures = [
    "Automated road network extraction from map data",
    "Mixed traffic simulation (2W, 3W, 4W, buses)",
    "Variable lane discipline modeling",
    "Real-time congestion analytics",
    "Scenario comparison capabilities",
    "Export-ready simulation results"
  ];

  return (
    <section id="methodology" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Methodology</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A systematic approach to modeling Indian urban traffic conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {methodologies.map((item, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-6 border border-border hover:shadow-soft transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-8 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
