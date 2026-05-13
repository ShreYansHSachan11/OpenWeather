# State Directory

This directory contains Redux state management logic using Redux Toolkit.

## Structure

- **slices/**: Redux slices for different state domains
  - `weatherSlice.ts`: Weather data and API state
  - `uiSlice.ts`: UI preferences and search history
- **selectors/**: Reusable selector functions
  - `weatherSelectors.ts`: Selectors for weather state
  - `uiSelectors.ts`: Selectors for UI state
- **store.ts**: Redux store configuration with typed hooks
- **index.ts**: Barrel export for easy imports

## Store Configuration

The Redux store is configured in `store.ts` and combines the following slices:

- **weather**: Manages weather data, forecast, loading states, and cache
- **ui**: Manages theme preferences and search history

### Typed Hooks

The store exports typed versions of Redux hooks for use in React components:

- **useAppDispatch**: Typed dispatch hook with support for async thunks
- **useAppSelector**: Typed selector hook with RootState typing

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from './state/store';
import { searchWeather } from './state/slices/weatherSlice';
import { selectCurrentWeather, selectLoading } from './state/selectors/weatherSelectors';

function WeatherComponent() {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(selectCurrentWeather);
  const loading = useAppSelector(selectLoading);
  
  const handleSearch = (city: string) => {
    dispatch(searchWeather(city));
  };
  
  // Component logic...
}
```

See `store.example.tsx` for more detailed usage examples.

## State Management Guidelines

- Use Redux Toolkit for all state management
- Use typed hooks (useAppDispatch, useAppSelector) instead of plain Redux hooks
- Define typed selectors for accessing state
- Use async thunks for API calls
- Keep reducers pure and immutable
- Import from `./state` barrel export for cleaner imports
