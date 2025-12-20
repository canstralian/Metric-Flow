import { useQuery } from "@tanstack/react-query";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  atl: number;
  last_updated: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
  };
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    market_cap_btc: number;
    market_cap_change_percentage_24h_usd: number;
    btc_dominance: number;
    eth_dominance: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    updated_at: number;
  };
}

/**
 * Fetch live price data for a single cryptocurrency
 */
export function useCoinPrice(coinId: string) {
  return useQuery<CoinPrice>({
    queryKey: ["/api/prices/coin", coinId],
    refetchInterval: 60000, // Refresh every minute
    enabled: !!coinId,
  });
}

/**
 * Fetch live prices for multiple cryptocurrencies
 */
export function useMultipleCoinPrices(coinIds: string[]) {
  return useQuery<CoinPrice[]>({
    queryKey: ["/api/prices/multiple", coinIds.join(",")],
    enabled: coinIds.length > 0,
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Fetch trending cryptocurrencies
 */
export function useTrendingCoins() {
  return useQuery<{ coins: TrendingCoin[] }>({
    queryKey: ["/api/prices/trending"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}

/**
 * Fetch global market data
 */
export function useGlobalMarketData() {
  return useQuery<GlobalMarketData>({
    queryKey: ["/api/prices/global"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}
