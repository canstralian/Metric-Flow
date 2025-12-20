# REST Express

A full-stack application for monitoring metrics and managing alerts with real-time updates. Built with Express, React, and PostgreSQL.

## Features

- **Metrics Tracking**: Store and retrieve data points with types, symbols, and sources
- **Smart Alerts**: Create and manage custom alerts with threshold conditions
- **Real-Time Updates**: WebSocket support for live metric and alert notifications
- **User Management**: Secure user authentication and profile management
- **Session Management**: Persistent session storage with PostgreSQL
- **Dark Mode**: Built-in theme switching with local storage persistence

## Tech Stack

### Backend
- **Express** - Web framework
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Data persistence
- **Passport** - Authentication
- **WebSocket** - Real-time communication

### Frontend
- **React** - UI library
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **TanStack Query** - Data fetching and caching
- **Wouter** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Type-safe validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Replit's built-in database)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# These are automatically configured if using Replit's database
DATABASE_URL=your_postgresql_url
```

4. Push the schema to your database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable UI components
│       └── App.tsx        # Main application component
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data access layer
│   └── db.ts             # Database connection
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle ORM schema and Zod types
└── migrations/           # Database migrations (auto-generated)
```

## Database Schema

### Users
- Stores user account information
- Compatible with Replit Auth
- Fields: id, email, username, firstName, lastName, profileImageUrl

### Metrics
- Stores data points for monitoring
- Fields: id, type, value, symbol, source, timestamp, metadata

### Alerts
- User-configurable alert rules
- Fields: id, userId, name, metricType, condition, threshold, symbol, isActive, lastTriggeredAt

### Sessions
- Manages user sessions
- Fields: sid, sess, expire

## API Endpoints

### Metrics
- `GET /api/metrics` - Get metrics (with optional limit)
- `GET /api/metrics/latest` - Get latest metrics by symbol
- `POST /api/metrics` - Create a new metric

### Alerts
- `GET /api/alerts` - Get user's alerts
- `POST /api/alerts` - Create a new alert
- `PATCH /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert

### Users
- `GET /api/user` - Get current user
- `POST /api/user` - Update user profile

## WebSocket Events

The application supports real-time updates via WebSocket:

- `metric-update` - New metric data received
- `alert-triggered` - Alert condition met

## Development

### Build
```bash
npm run build
```

### Type Check
```bash
npm run check
```

### Database Migration
```bash
npm run db:push
```

## License

MIT License - see [LICENSE](./LICENSE) for details

## Support

For issues and questions, please open an issue on the project repository.
