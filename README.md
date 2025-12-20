# Metric-Flow

A real-time metrics monitoring and alerting system with a clean client/server architecture.

## What Metric-Flow is

Metric-Flow solves the problem of real-time metric tracking and alerting for time-series data. It provides a full-stack solution for ingesting metrics from various sources, visualizing them in real-time, and triggering alerts when thresholds are exceeded. Built for developers who need reliable monitoring without the complexity of enterprise observability platforms.

## Core concepts

- **Metrics**: Time-series data points with type, value, symbol, and source metadata
- **Flows**: Real-time data streams delivered via WebSocket connections
- **Alerts**: User-defined threshold conditions that trigger notifications
- **Client/Server split**: React frontend with Express backend, shared type definitions ensure type safety across the boundary

## Architecture

```
┌─────────────────┐
│   React Client  │  Vite + React + Tailwind + shadcn/ui
│   (Visualize)   │  Real-time charts via WebSocket
└────────┬────────┘
         │
    WebSocket + REST API
         │
┌────────┴────────┐
│  Express Server │  Node.js + TypeScript
│   (Ingest)      │  Routes + WebSocket + Auth
└────────┬────────┘
         │
┌────────┴────────┐
│   PostgreSQL    │  Drizzle ORM
│   (Persist)     │  Metrics + Users + Alerts
└─────────────────┘
```

**Data Flow:**
1. Metrics ingested via REST API
2. Stored in PostgreSQL with Drizzle ORM
3. Broadcast to connected clients via WebSocket
4. Alerts evaluated in real-time
5. Client renders live updates with Recharts

## Local development

### Prerequisites
- Node.js v20+ (see `.nvmrc`)
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Configure database (set DATABASE_URL in environment)
export DATABASE_URL="postgresql://user:password@localhost:5432/metricflow"

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000` with hot-reload enabled.

### Build and production

```bash
# Type check
npm run check

# Build for production
npm run build

# Start production server
npm start
```

## Production readiness

### Implemented ✅
- Full-stack TypeScript with shared types
- Real-time WebSocket communication
- PostgreSQL persistence with Drizzle ORM
- User authentication with Replit Auth integration
- Alert system with configurable thresholds
- Responsive UI with shadcn/ui components
- Development tooling (Vite, tsx, hot reload)

### Planned 🚧
- Comprehensive test coverage
- Metric aggregation and rollups
- Multi-tenant isolation
- Prometheus/OpenTelemetry export
- Horizontal scaling (Redis pub/sub for WebSocket)
- Rate limiting and backpressure
- Metric retention policies

## Non-goals

- **Not** a replacement for full observability platforms (Datadog, New Relic)
- **Not** a log aggregation system
- **Not** a distributed tracing system
- **Not** designed for high-cardinality metrics (millions of unique series)
- **Not** a standalone time-series database (uses PostgreSQL)

Metric-Flow is purpose-built for moderate-scale metric monitoring with emphasis on simplicity and developer experience.

## License

MIT - see LICENSE file for details.
