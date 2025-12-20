# Cryptocurrency Dashboard Design Guidelines

## Design Approach
**System:** Material Design (data-focused variant) inspired by Robinhood + Coinbase
**Rationale:** Information-dense financial interfaces require clear hierarchy, immediate data comprehension, and professional credibility. Material Design's grid system and elevation principles handle complex data layouts effectively.

## Core Design Principles
1. **Data First:** Price information and charts dominate the visual hierarchy
2. **Instant Recognition:** Color-coded gains/losses (green/red) universally understood
3. **Glanceable Metrics:** Critical data visible without interaction
4. **Professional Authority:** Clean, sophisticated aesthetic builds trust

---

## Typography System

**Font Stack:** Inter (primary), Roboto Mono (numbers/prices)

**Hierarchy:**
- Hero Headlines: 3xl to 4xl, bold (700)
- Section Headers: xl to 2xl, semibold (600)
- Price Data: lg to 2xl, mono font, medium (500)
- Body Text: base, regular (400)
- Labels/Meta: sm to xs, medium (500)
- All-caps labels: tracking-wide for metrics

---

## Layout Framework

**Spacing Units:** Tailwind 2, 4, 6, 8, 12, 16 (consistent rhythm)

**Grid System:**
- Main dashboard: 12-column grid
- Price cards: 3-4 columns desktop, 2 tablet, 1 mobile
- Analytics: 2-column split (chart + details)

**Container Strategy:**
- Dashboard content: max-w-7xl with px-4 to px-8
- Cards: Consistent padding of p-6
- Sections: py-12 to py-16 vertical spacing

---

## Component Architecture

**Navigation Header:**
- Fixed top bar with logo, search bar, profile menu
- Compact height (h-16) for maximum content space
- Search prominently centered with autocomplete

**Price Cards (Primary Component):**
- Coin icon + name + ticker symbol
- Large price display (mono font)
- Percentage change with directional arrow
- Sparkline mini-chart
- "Add Alert" button
- Card shadows: subtle elevation (shadow-sm to shadow-md)

**Live Price Table:**
- Sortable columns: Rank, Coin, Price, 24h%, 7d%, Market Cap, Volume
- Sticky header row
- Zebra striping for readability
- Clickable rows for detail view

**Interactive Charts:**
- TradingView-style candlestick/line charts
- Time period selector (1D, 7D, 1M, 3M, 1Y, ALL)
- Tooltips on hover showing exact values
- Chart occupies 2/3 width, stats sidebar 1/3

**Alert System Panel:**
- Slide-out drawer from right side
- Alert creation form: coin selector, condition (above/below), target price
- Active alerts list with edit/delete actions
- Alert status indicators

**Market Analytics Dashboard:**
- Grid of metric cards: Total Market Cap, 24h Volume, BTC Dominance, Fear & Greed Index
- Each metric card: large number, label, trend indicator
- 4-column grid desktop, 2-column tablet

**Sidebar Navigation:**
- Left-aligned, collapsible
- Icons + labels: Dashboard, Markets, Alerts, Portfolio, Settings
- Active state: subtle background highlight

---

## Data Visualization

**Price Movement Colors:**
- Positive: Use green shades for gains
- Negative: Use red shades for losses
- Neutral: Gray for unchanged

**Chart Guidelines:**
- Clean gridlines (subtle, not distracting)
- Smooth line rendering
- Volume bars beneath price chart
- Crosshair on hover

---

## Images Section

**Hero Section:**
- Full-width hero (h-96) with gradient overlay
- Background: Abstract financial/crypto themed imagery (digital coins, network nodes, trading graphs visualization)
- Overlay gradient: dark-to-transparent for text readability
- Hero content: "Track Crypto Markets in Real-Time" headline + quick stats (total coins tracked, live updates)
- CTA buttons with backdrop blur (backdrop-blur-md bg-white/20)

**Coin Logos:**
- Use CoinGecko API's coin images at 32x32 or 48x48
- Circular containers with subtle border
- Lazy load for performance

---

## Interactions & States

**Real-time Updates:**
- Subtle pulse animation on price changes
- Flash green/red briefly on update
- "Live" indicator badge pulsing

**Loading States:**
- Skeleton screens for cards (shimmer effect)
- Chart placeholder: simple line animation

**No Hover Interactions on Image Buttons** (backdrop-blur buttons handle their own states)

---

## Accessibility
- High contrast for price data
- ARIA labels on all interactive elements
- Keyboard navigation for table sorting
- Screen reader announcements for price updates

---

## Page Sections (Top to Bottom)

1. **Hero** (with image, h-96)
2. **Quick Market Overview** (4 metric cards)
3. **Trending Cryptocurrencies** (horizontal scrollable cards)
4. **Full Price Table** (sortable, paginated)
5. **Featured Chart Section** (BTC default, switchable)
6. **Market Analytics** (detailed metrics grid)

**Critical:** All sections fully designed, no placeholder content. Dashboard is comprehensive and data-rich from first load.