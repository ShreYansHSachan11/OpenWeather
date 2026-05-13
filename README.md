# OpenWeather

A React-based weather dashboard application that provides real-time weather information and 5-day forecasts for cities worldwide.

## Features

- 🌤️ Current weather conditions for any city
- 📅 5-day weather forecast
- 🔍 City search with validation
- 📜 Search history (last 10 searches)
- 🌓 Light/Dark theme toggle
- 💾 Data caching (10-minute cache)
- 📱 Responsive design (mobile, tablet, desktop)
- ⚡ Redux state management
- 🔒 TypeScript for type safety

## Technology Stack

- **Frontend**: React 18+ with functional components and hooks
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Type System**: TypeScript 5+
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library, fast-check
- **API**: OpenWeatherMap API

## Project Structure

```
src/
├── components/       # React components
├── state/           # Redux slices, store, and selectors
├── services/        # API services and HTTP client
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── test/            # Test utilities and setup
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenWeatherMap API key (get one at https://openweathermap.org/api)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Testing

The project uses a comprehensive testing strategy:

- **Unit Tests**: Jest and React Testing Library for component and function tests
- **Property-Based Tests**: fast-check for testing universal properties
- **Coverage Goal**: 70% minimum code coverage

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Architecture

### Component Hierarchy

```
App
├── ThemeProvider
│   ├── Header
│   │   ├── Logo
│   │   └── ThemeToggle
│   ├── SearchSection
│   │   ├── SearchInput
│   │   └── SearchHistory
│   ├── WeatherDisplay
│   │   ├── CurrentWeather
│   │   └── ForecastDisplay
│   ├── LoadingState
│   ├── ErrorState
│   └── EmptyState
```

### State Management

Redux store with two slices:
- **Weather Slice**: Current weather, forecast, loading states, errors, cache
- **UI Slice**: Theme preference, search history

### Data Flow

1. User enters city name in SearchInput
2. Redux action dispatched to fetch weather data
3. API service makes requests to OpenWeatherMap
4. Response parsed and stored in Redux store
5. Components re-render with new data

## API Integration

The application uses the OpenWeatherMap API:
- Current Weather API: `/weather`
- 5-Day Forecast API: `/forecast`


## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
