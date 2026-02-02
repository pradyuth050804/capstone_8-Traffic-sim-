import { Map, Route, BarChart3, Settings2, Play, ChevronRight, Network, Car, Building2, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HeroVisualization from "@/components/HeroVisualization";
import FeatureCard from "@/components/FeatureCard";
import ProcessFlow from "@/components/ProcessFlow";
import MethodologySection from "@/components/MethodologySection";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Map,
      title: "Real-World Data Integration",
      description: "Extracts authentic road geometry, lane configurations, and intersection details from Google Maps API."
    },
    {
      icon: Car,
      title: "Indian Traffic Modeling",
      description: "Simulates mixed traffic with two-wheelers, auto-rickshaws, buses, and cars with realistic lane discipline."
    },
    {
      icon: Network,
      title: "Dynamic Road Networks",
      description: "Models temporary obstacles, road surface quality, and construction zones affecting traffic flow."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Real-time metrics on congestion levels, average speeds, and bottleneck identification."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Route className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">RoadSim</h1>
              <p className="text-xs text-muted-foreground">Traffic Simulation</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Methodology</a>
            <Button onClick={() => navigate("/simulation")} size="sm">
              Start Simulation
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="stagger-children">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
                <Building2 className="w-3.5 h-3.5" />
                Capstone Project
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                High-Fidelity Road Network{" "}
                <span className="text-accent">& Traffic Simulation</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Automated road modeling and traffic simulation using real-world Google Maps data, 
                customized for Indian urban traffic conditions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate("/simulation")} className="group">
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Start Simulation
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#methodology">
                    View Methodology
                  </a>
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">15+</p>
                  <p className="text-sm text-muted-foreground">Road Parameters</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-sm text-muted-foreground">Vehicle Types</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Real-time</p>
                  <p className="text-sm text-muted-foreground">Analytics</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <HeroVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Simulation Pipeline</h2>
            <p className="text-muted-foreground">From raw map data to actionable traffic insights</p>
          </div>
          <ProcessFlow />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for modeling complex Indian urban traffic scenarios with high fidelity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <MethodologySection />

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Simulate?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Explore the simulation interface to model road networks and analyze traffic patterns.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/simulation")}
            className="group"
          >
            <Gauge className="w-4 h-4 mr-2" />
            Launch Simulation
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">RoadSim</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Capstone Project — High-Fidelity Road Network Modeling & Traffic Simulation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
