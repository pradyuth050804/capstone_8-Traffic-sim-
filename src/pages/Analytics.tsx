import { useState } from "react";
import { Link } from "react-router-dom";
import { Route, Home, Download, ArrowLeftRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrafficHeatmap from "@/components/analytics/TrafficHeatmap";
import TravelTimeChart from "@/components/analytics/TravelTimeChart";
import DelayChart from "@/components/analytics/DelayChart";
import ComparisonView from "@/components/analytics/ComparisonView";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Route className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">RoadSim</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Analytics Dashboard</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Link to="/simulation">
            <Button size="sm" variant="secondary">
              Back to Simulation
            </Button>
          </Link>
          <Link to="/">
            <Button size="sm" variant="ghost">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Average Speed"
            value="28.4 km/h"
            change={-5.2}
            description="vs. baseline"
          />
          <SummaryCard
            title="Peak Congestion"
            value="72%"
            change={12.5}
            description="during rush hour"
          />
          <SummaryCard
            title="Avg Travel Time"
            value="14.2 min"
            change={3.1}
            description="across network"
          />
          <SummaryCard
            title="Throughput"
            value="892 veh/hr"
            change={0}
            description="at capacity"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="heatmap">Traffic Heatmap</TabsTrigger>
            <TabsTrigger value="travel-time">Travel Time</TabsTrigger>
            <TabsTrigger value="delays">Delay Analysis</TabsTrigger>
            <TabsTrigger value="comparison" className="gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Traffic Density Heatmap</h3>
                <TrafficHeatmap />
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Average Travel Time by Hour</h3>
                <TravelTimeChart />
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Delay per Road Segment</h3>
              <DelayChart />
            </div>
          </TabsContent>

          <TabsContent value="heatmap">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Traffic Density Heatmap</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Visualization of traffic density across the road network over time.
              </p>
              <TrafficHeatmap fullSize />
            </div>
          </TabsContent>

          <TabsContent value="travel-time">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Travel Time Analysis</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Average travel time across the network by hour of day.
              </p>
              <TravelTimeChart fullSize />
            </div>
          </TabsContent>

          <TabsContent value="delays">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Delay Analysis by Segment</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Breakdown of delay contributions per road segment.
              </p>
              <DelayChart fullSize />
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  description: string;
}

const SummaryCard = ({ title, value, change, description }: SummaryCardProps) => {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-destructive" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-success" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change > 0) return "text-destructive";
    if (change < 0) return "text-success";
    return "text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <div className="flex items-center gap-1.5">
        {getTrendIcon()}
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {change !== 0 && (change > 0 ? "+" : "")}{change}%
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
};

export default Analytics;
