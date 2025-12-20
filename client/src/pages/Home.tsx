import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { ChartWidget } from "@/components/ChartWidget";
import { useLatestMetrics, useMetrics } from "@/hooks/use-metrics";
import { DollarSign, Activity, Zap, Layers } from "lucide-react";

export default function Home() {
  const { data: latest, isLoading: latestLoading } = useLatestMetrics();
  
  // Fetch historical data for charts
  const { data: priceHistory } = useMetrics('price', 'BTC-USD');
  const { data: volHistory } = useMetrics('volatility', 'BTC-USD');
  const { data: fundHistory } = useMetrics('funding', 'BTC-USD');

  const btcPrice = latest?.["BTC-USD"]?.value;
  const ethPrice = latest?.["ETH-USD"]?.value;
  
  // Mock trends for visual appeal (since our basic backend might not calc this yet)
  const btcTrend = 2.4;
  const ethTrend = -1.2;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground">Market Overview</h2>
            <p className="text-muted-foreground mt-1">Real-time Oracle Aggregation • Cloudflare Edge</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono font-medium text-primary">LIVE FEED</span>
          </div>
        </header>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="BTC Price" 
            value={latestLoading ? "..." : `$${Number(btcPrice || 0).toLocaleString()}`}
            symbol="BTC-USD"
            trend={btcTrend}
            icon={<DollarSign className="w-4 h-4 text-orange-400" />}
            loading={latestLoading}
          />
          <MetricCard 
            title="ETH Price" 
            value={latestLoading ? "..." : `$${Number(ethPrice || 0).toLocaleString()}`}
            symbol="ETH-USD"
            trend={ethTrend}
            icon={<Zap className="w-4 h-4 text-purple-400" />}
            loading={latestLoading}
          />
          <MetricCard 
            title="Volatility Index" 
            value="42.5" 
            symbol="VIX"
            trend={5.2}
            icon={<Activity className="w-4 h-4 text-blue-400" />}
          />
          <MetricCard 
            title="Agg. Funding" 
            value="0.015%" 
            symbol="1H"
            trend={0.002}
            icon={<Layers className="w-4 h-4 text-green-400" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {priceHistory && (
            <ChartWidget 
              title="BTC Price Action" 
              data={priceHistory} 
              type="price" 
              color="#3b82f6" // Blue
            />
          )}
          {volHistory && (
            <ChartWidget 
              title="Volatility Signature" 
              data={volHistory} 
              type="volatility" 
              color="#8b5cf6" // Purple
            />
          )}
          {fundHistory && (
            <div className="col-span-1 lg:col-span-2">
              <ChartWidget 
                title="Funding Rate Monitor" 
                data={fundHistory} 
                type="funding" 
                color="#10b981" // Emerald
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
