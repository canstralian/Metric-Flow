/**
 * CoinGecko API Service
 * Provides real-time cryptocurrency price data
 * Free API: https://www.coingecko.com/en/api/documentation
 */

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export interface CoinGeckoPrice {
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

export interface SimplePriceResponse {
  [key: string]: {
    [key: string]: number;
  };
}

// Cache to avoid rate limiting
const priceCache = new Map<string, { data: CoinGeckoPrice; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

async function fetchFromCoinGecko(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${COINGECKO_API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("CoinGecko API error:", error);
    throw error;
  }
}

/**
 * Get price data for a specific cryptocurrency
 * @param coinId - CoinGecko coin ID (e.g., "bitcoin", "ethereum")
 * @returns Price data including 24h change and market info
 */
export async function getCoinPrice(coinId: string): Promise<CoinGeckoPrice> {
  const cacheKey = coinId.toLowerCase();
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await fetchFromCoinGecko(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );

  const priceData: CoinGeckoPrice = {
    id: data.id,
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    current_price: data.market_data.current_price.usd,
    market_cap: data.market_data.market_cap.usd,
    market_cap_rank: data.market_data.market_cap_rank,
    total_volume: data.market_data.total_volume.usd,
    high_24h: data.market_data.high_24h.usd,
    low_24h: data.market_data.low_24h.usd,
    price_change_24h: data.market_data.price_change_24h_in_currency.usd,
    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h,
    circulating_supply: data.market_data.circulating_supply,
    total_supply: data.market_data.total_supply,
    ath: data.market_data.ath.usd,
    atl: data.market_data.atl.usd,
    last_updated: data.last_updated,
  };

  priceCache.set(cacheKey, { data: priceData, timestamp: Date.now() });
  return priceData;
}

/**
 * Get prices for multiple cryptocurrencies at once
 * @param coinIds - Array of CoinGecko coin IDs
 * @returns Array of price data
 */
export async function getMultipleCoinPrices(coinIds: string[]): Promise<CoinGeckoPrice[]> {
  const prices = await Promise.all(coinIds.map((id) => getCoinPrice(id)));
  return prices;
}

/**
 * Get simple price data (lighter request)
 * @param coinIds - Array of CoinGecko coin IDs
 * @param vs_currencies - Array of currencies (default: usd)
 * @returns Simple price data
 */
export async function getSimplePrices(
  coinIds: string[],
  vs_currencies: string[] = ["usd"]
): Promise<SimplePriceResponse> {
  const ids = coinIds.join(",");
  const currencies = vs_currencies.join(",");
  return fetchFromCoinGecko(`/simple/price?ids=${ids}&vs_currencies=${currencies}`);
}

/**
 * Get trending cryptocurrencies
 * @returns Top 7 trending coins
 */
export async function getTrendingCoins(): Promise<any> {
  return fetchFromCoinGecko("/search/trending");
}

/**
 * Get cryptocurrency market data (global)
 * @returns Global market data
 */
export async function getGlobalMarketData(): Promise<any> {
  return fetchFromCoinGecko("/global");
}
