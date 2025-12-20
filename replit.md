# Cryptocurrency Price Tracker - Project Documentation

## Project Overview
A real-time cryptocurrency price tracking dashboard with live price data via CoinGecko API, price alerts system, and market analytics. Built with Express, React, Vite, PostgreSQL, and Drizzle ORM.

## Architecture
- **Frontend:** React with TypeScript, Tailwind CSS, Shadcn UI components, Wouter for routing
- **Backend:** Express.js with Node.js, PostgreSQL database via Neon, Drizzle ORM
- **External APIs:** CoinGecko API (free tier) for live cryptocurrency prices
- **Real-time Updates:** Data fetched and cached server-side with configurable refresh intervals

## Key Features Implemented

### 1. Live Price Data (CoinGecko Integration)
- **Service:** `server/coingecko.ts` - Complete CoinGecko API wrapper
- **Features:**
  - Fetch single coin prices: `/api/prices/coin/:id`
  - Batch fetch multiple coins: `/api/prices/multiple?ids=bitcoin,ethereum`
  - Get trending coins: `/api/prices/trending`
  - Global market data: `/api/prices/global`
- **Caching:** In-memory cache (60s TTL) to avoid rate limiting
- **Auto-store:** Prices automatically stored in database for historical tracking
- **Supported Coins:** Bitcoin, Ethereum, and 10,000+ other cryptocurrencies

### 2. Frontend Hooks
- **`use-prices.ts`:** TanStack Query hooks for live price data
  - `useCoinPrice()` - Single coin with 60s auto-refresh
  - `useMultipleCoinPrices()` - Multiple coins
  - `useTrendingCoins()` - Top trending (5min refresh)
  - `useGlobalMarketData()` - Global stats (5min refresh)

### 3. Dashboard Components
- **Home Page:** Live BTC/ETH prices, trending coins grid, 24h volume, market cap rank
- **Metrics Display:** Real-time price cards with 24h change % and trend indicators
- **Trending Section:** Top 8 trending coins with score and BTC price

### 4. Mobile Navigation
- **Hamburger Menu:** Collapsible sidebar for mobile devices (< md breakpoint)
- **Overlay:** Dark transparent overlay when sidebar is open
- **Auto-close:** Sidebar closes when clicking overlay or navigating

### 5. Search Filtering
- **SearchBar Component:** `client/src/components/SearchBar.tsx`
- **Keyboard Shortcut:** Cmd/Ctrl+K opens search focus
- **Real-time Filtering:** Filters trending coins by name or symbol as user types
- **Clear Button:** Clears search and resets to show all trending coins

### 6. Database Schema
- **metrics table:** Stores all price data with metadata (high/low/volume/etc)
- **Automatic recording:** Each API call stores a metric record for historical analysis

## API Endpoints

### Price Endpoints
```
GET /api/prices/coin/:id           # Single coin price (detailed)
GET /api/prices/multiple?ids=...   # Multiple coins (batch)
GET /api/prices/trending           # Top 7 trending coins
GET /api/prices/global             # Global market stats
```

### Example Requests
```bash
# Get Bitcoin current price
curl http://localhost:5000/api/prices/coin/bitcoin

# Get multiple coins
curl http://localhost:5000/api/prices/multiple?ids=bitcoin,ethereum,cardano

# Get trending coins
curl http://localhost:5000/api/prices/trending
```

## Recent Changes (Dec 20, 2025)

### Created Files
- `server/coingecko.ts` - CoinGecko API service with caching
- `client/src/hooks/use-prices.ts` - React Query hooks for price data
- `client/src/components/SearchBar.tsx` - Search input with keyboard shortcut
- `design_guidelines.md` - Full design system for crypto dashboard

### Modified Files
- `server/routes.ts` - Added 4 new price endpoints with error handling
- `client/src/pages/Home.tsx` - Live prices, trending coins, search filtering, mobile nav
- `client/src/pages/Alerts.tsx` - Added mobile navigation support
- `client/src/pages/Explorer.tsx` - Added mobile navigation support
- `client/src/components/Sidebar.tsx` - Added mobile menu toggle with overlay

## Data Flow
1. Frontend component calls React Query hook (e.g., `useCoinPrice("bitcoin")`)
2. Hook fetches from `/api/prices/coin/bitcoin`
3. Backend service calls CoinGecko API
4. Response cached in-memory for 60 seconds
5. Data stored in PostgreSQL metrics table
6. Response sent to frontend with all metadata
7. Component re-renders with live price, change %, high/low, volume, etc.
8. Auto-refetch every 60 seconds (configurable)

## CoinGecko API Notes
- **Rate Limit:** 10-50 calls/minute (free tier)
- **No Auth Required:** Public API, no API key needed
- **Data Quality:** Aggregated from multiple exchanges
- **Coverage:** 10,000+ cryptocurrencies

## Design System
- Typography: Inter font, hierarchical text colors
- Layout: Material Design inspired, information-dense
- Colors: Green for gains, red for losses, professional styling
- Components: Shadcn UI system, fully accessible

## Next Steps (Future Enhancements)
- Add WebSocket support for real-time streaming (sub 60s updates)
- Implement price alert notifications
- Add more detailed charts with TradingView integration
- Portfolio tracking and P&L calculations
- Export/CSV download functionality
- Additional coin metrics (dominance, fear/greed index)

## Running the Project
```bash
npm run dev    # Starts both backend (Express) and frontend (Vite)
```

The application will be available at http://localhost:5000

## Database Setup
Automatic via Replit database integration - no manual setup required.

## Testing the Live Prices
1. Navigate to Home page
2. See live BTC/ETH prices in the metrics cards
3. Trending section shows top 4 coins by score
4. Prices auto-refresh every 60 seconds
5. All price history stored in database
