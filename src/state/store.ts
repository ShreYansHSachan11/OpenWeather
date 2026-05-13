/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with weather and UI slices.
 * Exports typed hooks for use in React components.
 * 
 * **Validates: Requirements 2.6, 8.2**
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import weatherReducer from './slices/weatherSlice/weatherSlice';
import uiReducer from './slices/uiSlice/uiSlice';
import type { RootState } from '../types/state.types';

/**
 * Configure Redux store
 * 
 * Combines weather and UI slices into a single store.
 * 
 * **Validates: Requirements 2.6, 8.2**
 */
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    ui: uiReducer,
  },
});

/**
 * Type for dispatch function
 * Inferred from the store itself
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Typed useDispatch hook
 * 
 * Use this hook instead of plain useDispatch to get proper typing
 * for async thunks and actions.
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(searchWeather('London'));
 * 
 * **Validates: Requirements 2.6, 8.2**
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed useSelector hook
 * 
 * Use this hook instead of plain useSelector to get proper typing
 * for the Redux state.
 * 
 * @example
 * const weather = useAppSelector(selectCurrentWeather);
 * const loading = useAppSelector(state => state.weather.loading);
 * 
 * **Validates: Requirements 2.6, 8.2**
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
