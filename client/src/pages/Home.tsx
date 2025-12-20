import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { ChartWidget } from "@/components/ChartWidget";
import { useLatestMetrics, useMetrics } from "@/hooks/use-metrics";
import { useCoinPrice, useMultipleCoinPrices, useTrendingCoins } from "@/hooks/use-prices";
import { DollarSign, Activity, Zap, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // Live CoinGecko prices
  const { data: btcData, isLoading: btcLoading } = useCoinPrice("bitcoin");
  const { data: ethData, isLoading: ethLoading } = useCoinPrice("ethereum");
  const { data: trending, isLoading: trendingLoading } = useTrendingCoins();
  
  // Fallback to old metrics
  const { data: latest, isLoading: latestLoading } = useLatestMetrics();
  const { data: priceHistory } = useMetrics('price', 'BTC-USD');
  const { data: volHistory } = useMetrics('volatility', 'BTC-USD');
  const { data: fundHistory } = useMetrics('funding', 'BTC-USD');

  const btcPrice = btcData?.current_price || latest?.["BTC-USD"]?.value;
  const btcChange = btcData?.price_change_percentage_24h || 2.4;
  const ethPrice = ethData?.current_price || latest?.["ETH-USD"]?.value;
  const ethChange = ethData?.price_change_percentage_24h || -1.2;

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

        {/* Key Metrics Grid with Live Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="BTC Price" 
            value={btcLoading ? "..." : `$${Number(btcPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            symbol="BTC-USD"
            trend={btcChange}
            icon={<DollarSign className="w-4 h-4 text-orange-400" />}
            loading={btcLoading}
          />
          <MetricCard 
            title="ETH Price" 
            value={ethLoading ? "..." : `$${Number(ethPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            symbol="ETH-USD"
            trend={ethChange}
            icon={<Zap className="w-4 h-4 text-purple-400" />}
            loading={ethLoading}
          />
          <MetricCard 
            title="24h Volume" 
            value={btcData?.total_volume ? `$${(btcData.total_volume / 1e9).toFixed(1)}B` : "..."}
            symbol="Global"
            trend={btcData ? btcData.market_cap_change_percentage_24h : 0}
            icon={<Activity className="w-4 h-4 text-blue-400" />}
            loading={btcLoading}
          />
          <MetricCard 
            title="Market Cap Rank" 
            value={btcData?.market_cap_rank ? `#${btcData.market_cap_rank}` : "..."}
            symbol="BTC"
            trend={0}
            icon={<Layers className="w-4 h-4 text-green-400" />}
            loading={btcLoading}
          />
        </div>

        {/* Trending Coins Section */}
        {trending?.coins && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" data-testid="text-trending-title">Trending Cryptocurrencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trending.coins.slice(0, 4).map((coin) => (
                <Card key={coin.item.id} className="p-4 hover-elevate" data-testid={`card-trending-${coin.item.id}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {coin.item.small && (
                      <img src={coin.item.small} alt={coin.item.name} className="w-6 h-6 rounded-full" />
                    )}
                    <div>
                      <p className="font-semibold text-sm" data-testid={`text-coin-name-${coin.item.id}`}>{coin.item.name}</p>
                      <p className="text-xs text-muted-foreground">{coin.item.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="text-lg font-mono font-semibold" data-testid={`text-price-${coin.item.id}`}>
                    ₿ {coin.item.price_btc.toFixed(8)}
                  </p>
                  <p className="text-xs text-muted-foreground">Score: {coin.item.score}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

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
